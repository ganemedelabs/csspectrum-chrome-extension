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
 * Processes a <pre> tag by reconstructing its text, matching colors, and preserving non-color tags.
 *
 * @param preElement - The <pre> element to process.
 * @param options - Processing options.
 */
// FIXME: Sometimes messes up the whole pre tag.
function processPreTag(preElement: HTMLElement, options = { modern: false, includeSpaces: false }) {
    const fullText = preElement.textContent || "";
    if (!fullText) return;

    const matches = [];
    const colorPatterns = Color.patterns;

    for (const [key, pattern] of Object.entries(colorPatterns)) {
        const sanitizedSource = pattern.source.replace(/^\^/, "").replace(/\$$/, "");
        const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
        const regex = new RegExp(sanitizedSource, flags);

        let match;
        while ((match = regex.exec(fullText)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                matchText: match[0],
                type: key,
            });
        }
    }

    if (matches.length === 0) return;

    matches.sort((a, b) => a.start - b.start || b.end - a.end);

    const filteredMatches = [];
    let lastEnd = -1;
    for (const match of matches) {
        if (match.start >= lastEnd) {
            filteredMatches.push(match);
            lastEnd = match.end;
        }
    }

    if (filteredMatches.length === 0) return;

    const { space: supportedColorSpace, useColorFunction } = getSupportedColorSpace();

    const fragment = document.createDocumentFragment();
    let currentIndex = 0;
    const walker = document.createTreeWalker(preElement, NodeFilter.SHOW_ALL, null);
    const nodeQueue = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
        nodeQueue.push(node);
    }

    let textBuffer = "";
    for (const { start, end, matchText } of filteredMatches) {
        while (currentIndex < start && nodeQueue.length) {
            node = nodeQueue.shift() as Node;
            if (node.nodeType === Node.TEXT_NODE) {
                textBuffer += node.nodeValue || "";
                if (textBuffer.length >= start - currentIndex) {
                    const splitPoint = start - currentIndex;
                    fragment.appendChild(document.createTextNode(node.nodeValue?.slice(0, splitPoint) as string));
                    node.nodeValue = node.nodeValue!.slice(splitPoint);
                    nodeQueue.unshift(node);
                    currentIndex = start;
                    textBuffer = "";
                } else {
                    fragment.appendChild(node.cloneNode(true));
                    currentIndex += node.nodeValue?.length as number;
                }
            } else {
                fragment.appendChild(node.cloneNode(true));
            }
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
                    exclude: options.includeSpaces ? [] : [...Color.getSupportedSpaces()],
                });
            } else {
                nextColor = Color.from(currentColor).toNextColor(wrapper.textContent as string, {
                    modern: options.modern,
                    exclude: options.includeSpaces ? [] : [...Color.getSupportedSpaces()],
                });
            }
            wrapper.textContent = nextColor as string;
        });

        fragment.appendChild(wrapper);
        currentIndex = end;

        while (nodeQueue.length && textBuffer.length < end - start) {
            node = nodeQueue.shift() as Node;
            if (node.nodeType === Node.TEXT_NODE) {
                textBuffer += node.nodeValue || "";
            }
        }
    }

    while (nodeQueue.length) {
        node = nodeQueue.shift() as Node;
        fragment.appendChild(node.cloneNode(true));
    }

    preElement.innerHTML = "";
    preElement.appendChild(fragment);
}

/**
 * Processes a DOM node recursively.
 *
 * @param node - The DOM node to process.
 * @returns A promise that resolves once processing is complete.
 */
async function processNode(node: Node, options = { modern: false, includeSpaces: false }): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text, options);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        const excludedTags = ["SCRIPT", "STYLE", "NOSCRIPT", "SVG"];
        if (element.tagName === "PRE") {
            processPreTag(element, options);
        } else if (!excludedTags.includes(element.tagName)) {
            for (const child of Array.from(node.childNodes)) {
                await processNode(child, options);
            }
        }
    }
}

/**
 * Processes a text node to find and highlight color patterns within the text.
 *
 * @param textNode - The text node to process.
 */
function processTextNode(textNode: Text, options = { modern: false, includeSpaces: false }) {
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
                    exclude: options.includeSpaces ? [] : [...Color.getSupportedSpaces()],
                });
            } else {
                nextColor = Color.from(currentColor).toNextColor(wrapper.textContent as string, {
                    modern: options.modern,
                    exclude: options.includeSpaces ? [] : [...Color.getSupportedSpaces()],
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

window.addEventListener("load", () => {
    chrome.storage.sync.get({ enabled: true, modern: false, includeSpaces: false }, (result) => {
        if (result.enabled) {
            processNode(document.body, { modern: result.modern, includeSpaces: result.includeSpaces });
        }
    });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
        const newEnabled = changes.enabled ? changes.enabled.newValue : null;
        const newModern = changes.modern ? changes.modern.newValue : null;
        const newIncludeSpaces = changes.includeSpaces ? changes.includeSpaces.newValue : null;

        if (newEnabled !== null) {
            if (newEnabled) {
                processNode(document.body, { modern: newModern, includeSpaces: newIncludeSpaces });
            } else {
                window.location.reload();
            }
        } else if (newModern !== null) {
            window.location.reload();
        } else if (newIncludeSpaces !== null) {
            window.location.reload();
        }
    }
});
