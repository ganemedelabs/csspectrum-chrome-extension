import Color, { type Space } from "./Color";

/**
 * Determines the largest supported color space and syntax.
 *
 * @returns {{ space: string, useColorFunction: boolean }}
 */
function getSupportedColorSpace() {
    if (!CSS.supports) {
        return { space: "srgb", useColorFunction: false };
    }

    const colorSpaces = Color.getSupportedSpaces();
    for (const space of colorSpaces) {
        if (CSS.supports("background", `color(${space} 1 0 0)`)) {
            return { space, useColorFunction: true };
        }
    }
    return { space: "srgb", useColorFunction: CSS.supports("background", "color(srgb 1 0 0)") };
}

/**
 * Processes a text node to find and highlight color patterns within the text.
 *
 * @param textNode - The text node to process.
 */
function processTextNode(textNode: Text, options = { modern: false, includeGamuts: false }) {
    const text = textNode.nodeValue;
    if (!text) return;

    const matches = [];
    const colorPatterns = Color.patterns;

    for (const [key, pattern] of Object.entries(colorPatterns)) {
        const sanitizedSource = pattern.source.replace(/^\^/, "").replace(/\$$/, "");
        const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
        const regex = new RegExp(sanitizedSource, flags);

        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                matchText: match[0],
                type: key,
            });
        }
    }

    if (matches.length === 0) return;

    matches.sort((a, b) => a.start - b.start);

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    const { space: supportedColorSpace, useColorFunction } = getSupportedColorSpace();

    for (const { start, end, matchText } of matches) {
        if (start < lastIndex) continue;

        if (start > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }

        const wrapper = document.createElement("mark");
        const colorString = matchText.trim();
        const color = Color.from(colorString);

        const xyzColor = color.to("xyz");
        const displayColor = useColorFunction ? color.to(supportedColorSpace as Space) : color.to("rgb");
        const isNamedColor = colorPatterns.named.test(matchText);

        const pageBgColor = (() => {
            const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
            if (Color.from(bodyBgColor).equals("transparent")) return "#fff";
            return bodyBgColor;
        })();

        wrapper.style.background = displayColor;
        wrapper.style.color = color.isDark(pageBgColor) ? "#fff" : "#000";
        wrapper.style.border = `2px solid ${displayColor.startsWith("rgba") ? displayColor.replace(/[^,]+(?=\))/, "1") : displayColor}`;
        wrapper.style.borderRadius = "3px";
        wrapper.style.padding = "0 3px";
        wrapper.style.cursor = "pointer";
        wrapper.textContent = matchText;

        wrapper.setAttribute("data-csspectrum-color", xyzColor);
        if (isNamedColor) {
            wrapper.setAttribute("data-csspectrum-name", matchText);
        }

        wrapper.addEventListener("click", (event) => {
            if (!event.ctrlKey && !event.metaKey) {
                event.preventDefault();
            }

            let nextColor;
            const originalNamedColor = wrapper.getAttribute("data-csspectrum-name") || undefined;
            const currentColor = wrapper.getAttribute("data-csspectrum-color") || "";

            if (originalNamedColor) {
                nextColor = Color.from(originalNamedColor).toNextColor(wrapper.textContent as string, {
                    modern: options.modern,
                    exclude: options.includeGamuts ? [] : [...Color.getSupportedSpaces()],
                });
            } else {
                nextColor = Color.from(currentColor).toNextColor(wrapper.textContent as string, {
                    modern: options.modern,
                    exclude: options.includeGamuts ? [] : [...Color.getSupportedSpaces()],
                });
            }

            wrapper.textContent = nextColor as string;
        });

        fragment.appendChild(wrapper);
        lastIndex = end;
    }

    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
}

/**
 * Processes a DOM node recursively.
 *
 * @param node - The DOM node to process.
 * @returns A promise that resolves once processing is complete.
 */
async function processNode(node: Node, options = { modern: false, includeGamuts: false }): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text, options);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const excludedTags = ["SCRIPT", "STYLE", "NOSCRIPT", "SVG"];
        if (!excludedTags.includes((node as Element).tagName)) {
            for (const child of Array.from(node.childNodes)) {
                await processNode(child, options);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get({ enabled: true, modern: false, includeGamuts: false }, (result) => {
        if (result.enabled) {
            processNode(document.body, { modern: result.modern, includeGamuts: result.includeGamuts });
        }
    });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
        const newEnabled = changes.enabled ? changes.enabled.newValue : null;
        const newModern = changes.modern ? changes.modern.newValue : null;
        const newIncludeGamuts = changes.includeGamuts ? changes.includeGamuts.newValue : null;

        if (newEnabled !== null) {
            if (newEnabled) {
                processNode(document.body, { modern: newModern, includeGamuts: newIncludeGamuts });
            } else {
                window.location.reload();
            }
        } else if (newModern !== null) {
            window.location.reload();
        } else if (newIncludeGamuts !== null) {
            window.location.reload();
        }
    }
});
