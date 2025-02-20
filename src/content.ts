import Color from "./Color";

/**
 * Processes a text node to find and highlight color patterns within the text.
 *
 * This function searches for color patterns defined in the `Color.patterns` object within the text content
 * of the provided text node. It wraps the matched color patterns in a `<mark>` element with appropriate
 * styles and attributes. The function also adds a click event listener to the `<mark>` elements to allow
 * cycling through different color representations.
 *
 * @param {Text} textNode - The text node to process and highlight color patterns within.
 *
 * @remarks
 * The function performs the following steps:
 * 1. Extracts the text content from the provided text node.
 * 2. Searches for color patterns within the text using regular expressions.
 * 3. Wraps matched color patterns in `<mark>` elements with styles and attributes.
 * 4. Adds a click event listener to the `<mark>` elements to cycle through color representations.
 * 5. Replaces the original text node with a document fragment containing the processed content.
 */
function processTextNode(textNode: Text, modern = false) {
    const text = textNode.nodeValue;
    if (!text) return;

    const matches = [];
    const colorPatterns = Color.patterns;

    for (const [key, pattern] of Object.entries(colorPatterns)) {
        const flags = pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g";
        const regex = new RegExp(pattern.source, flags);

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

    for (const { start, end, matchText } of matches) {
        if (start < lastIndex) continue;

        if (start > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }

        const wrapper = document.createElement("mark");
        const colorString = matchText.trim();
        const bgColor = Color.from(colorString).to("RGB", { modern: false }) as string;
        const isNamedColor = colorPatterns.named.test(matchText);

        const pageBgColor = (function () {
            const bodyBgColor = window.getComputedStyle(document.body).backgroundColor;
            if (Color.from(bodyBgColor).equals("transparent")) return "#fff";
            return bodyBgColor;
        })();

        wrapper.style.background = bgColor;
        wrapper.style.color = Color.from(bgColor).isDark(pageBgColor) ? "#fff" : "#000";
        wrapper.style.border = `2px solid ${bgColor.startsWith("rgba") ? bgColor.replace(/[^,]+(?=\))/, "1") : bgColor}`;
        wrapper.style.borderRadius = "3px";
        wrapper.style.padding = "0 3px";
        wrapper.style.cursor = "pointer";
        wrapper.textContent = matchText;

        wrapper.setAttribute("data-csspectrum-color", bgColor);
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
                nextColor = Color.from(originalNamedColor).toNextColor(wrapper.textContent as string, { modern });
            } else {
                nextColor = Color.from(currentColor).toNextColor(wrapper.textContent as string, { modern });
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
 * Processes a DOM node recursively. If the node is a text node, it processes the text content.
 * If the node is an element node, it recursively processes its child nodes, excluding certain tags.
 *
 * @param {Node} node - The DOM node to process.
 * @returns {Promise<void>} - A promise that resolves once the node and its children have been processed.
 */
async function processNode(node: Node, modern: boolean): Promise<void> {
    if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text, modern);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const excludedTags = ["SCRIPT", "STYLE", "NOSCRIPT", "SVG"];
        if (!excludedTags.includes((node as Element).tagName)) {
            for (const child of Array.from(node.childNodes)) {
                await processNode(child, modern);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get({ enabled: true, modern: false }, (result) => {
        if (result.enabled) {
            processNode(document.body, result.modern);
        }
    });
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
        const newEnabled = changes.enabled ? changes.enabled.newValue : null;
        const newModern = changes.modern ? changes.modern.newValue : null;

        if (newEnabled !== null) {
            if (newEnabled) {
                processNode(document.body, newModern);
            } else {
                window.location.reload();
            }
        } else if (newModern !== null) {
            window.location.reload();
        }
    }
});
