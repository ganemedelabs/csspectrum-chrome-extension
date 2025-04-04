import { Color } from "csspectrum";

type Options = { modern: boolean; includeSpaces: boolean };

const { space: supportedColorSpace, useColorFunction } = getSupportedColorSpace();

/**
 * Determines the best supported color space and whether the `color()` function
 * can be used in CSS for that color space.
 *
 * @returns An object containing:
 * - `space`: The name of the supported color space (e.g., "srgb").
 * - `useColorFunction`: A boolean indicating whether the `color()` function
 *   can be used with the determined color space in CSS.
 *
 * If the `CSS.supports` API is unavailable, it defaults to the "srgb" color
 * space with `useColorFunction` set to `false`.
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
 * Finds and returns all color matches within a given text based on predefined color patterns.
 *
 * @param text - The input string to search for color patterns.
 * @returns An array of objects representing the matches found.
 */
function findColorMatches(text: string) {
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
    return matches;
}

/**
 * Creates a styled `<mark>` element for a color with optional initial text and interactivity.
 *
 * @param matchText - The color text to process.
 * @param options - Configuration options.
 * @param initialText - Optional text to set initially in the `<mark>` element.
 * @returns The styled `<mark>` element.
 */
function createMarkElement(matchText: string, options: Options, initialText?: string) {
    const wrapper = document.createElement("mark");
    const colorString = matchText.trim();
    const color = Color.from(colorString);

    const xyzColor = color.to("xyz");
    const displayColor = useColorFunction ? color.to(supportedColorSpace) : color.to("rgb");
    const isNamedColor = Color.patterns.named.test(matchText);

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
    wrapper.textContent = initialText || "";

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
        wrapper.textContent = nextColor;
    });

    return wrapper;
}

/**
 * Processes a `<pre>` element to highlight color patterns.
 *
 * @param preElement - The `<pre>` element to process.
 * @param options - Configuration options.
 */
function processPreTag(preElement: HTMLElement, options: Options = { modern: false, includeSpaces: false }) {
    const fullText = preElement.textContent || "";
    if (!fullText) return;

    const matches = findColorMatches(fullText);
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

    const state = {
        currentMatchIndex: 0,
        currentIndex: 0,
        currentMatch: null,
        currentMark: null,
    };
    const fragment = document.createDocumentFragment();

    for (const child of Array.from(preElement.childNodes)) {
        processSubtree(child, fragment, fragment, filteredMatches, state, options);
    }

    preElement.innerHTML = "";
    preElement.appendChild(fragment);
}

/**
 * Processes a text node to highlight color patterns.
 *
 * @param textNode - The text node to process.
 * @param options - Configuration options.
 */
function processTextNode(textNode: Text, options: Options = { modern: false, includeSpaces: false }) {
    const text = textNode.nodeValue;
    if (!text) return;

    const matches = findColorMatches(text);
    if (matches.length === 0) return;

    matches.sort((a, b) => a.start - b.start);

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    for (const { start, end, matchText } of matches) {
        if (start < lastIndex) continue;

        if (start > lastIndex) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
        }

        const wrapper = createMarkElement(matchText, options, matchText);
        fragment.appendChild(wrapper);
        lastIndex = end;
    }

    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
}

/**
 * Processes a DOM subtree to apply matches and wrap matched text in custom mark elements.
 *
 * @param node - The current DOM node being processed.
 * @param fragment - The document fragment where processed nodes are appended.
 * @param parentFragment - The parent fragment for appending remaining text outside marks.
 * @param matches - An array of match objects containing start, end, matchText, and type.
 * @param state - The current processing state, including:
 *   - `currentMatchIndex`: Index of the current match being processed.
 *   - `currentIndex`: The current character index in the text.
 *   - `currentMatch`: The current match object or `null` if no match is active.
 *   - `currentMark`: The current mark element being appended to or `null`.
 * @param options - Configuration options used when creating mark elements.y
 */
function processSubtree(
    node: Node,
    fragment: Node,
    parentFragment: Node,
    matches: { start: number; end: number; matchText: string; type: string }[],
    state: {
        currentMatchIndex: number;
        currentIndex: number;
        currentMatch: { start: number; end: number; matchText: string; type: string } | null;
        currentMark: HTMLElement | null;
    },
    options: Options
) {
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || "";
        if (!text) return;

        const textStart = state.currentIndex;
        const textEnd = state.currentIndex + text.length;
        let pos = 0;

        while (pos < text.length) {
            if (state.currentMark && state.currentMatch) {
                const matchEndInText = state.currentMatch.end - textStart;
                if (matchEndInText <= text.length) {
                    const insideText = text.slice(pos, matchEndInText);
                    state.currentMark.appendChild(document.createTextNode(insideText));
                    pos = matchEndInText;
                    state.currentMatch = null;
                    state.currentMark = null;
                    state.currentMatchIndex++;
                    // Append remaining text outside the mark
                    if (pos < text.length) {
                        const remainingText = text.slice(pos);
                        if (node.parentNode) {
                            const clonedElement = node.parentNode.cloneNode(false) as HTMLElement;
                            clonedElement.appendChild(document.createTextNode(remainingText));
                            parentFragment.appendChild(clonedElement);
                        } else {
                            parentFragment.appendChild(document.createTextNode(remainingText));
                        }
                        pos = text.length;
                    }
                } else {
                    const insideText = text.slice(pos);
                    state.currentMark.appendChild(document.createTextNode(insideText));
                    pos = text.length;
                }
            } else {
                if (state.currentMatchIndex >= matches.length) {
                    fragment.appendChild(document.createTextNode(text.slice(pos)));
                    pos = text.length;
                } else {
                    const nextMatch = matches[state.currentMatchIndex];
                    if (nextMatch.start >= textEnd) {
                        fragment.appendChild(document.createTextNode(text.slice(pos)));
                        pos = text.length;
                    } else if (nextMatch.start <= textStart) {
                        state.currentMatch = nextMatch;
                        state.currentMark = createMarkElement(nextMatch.matchText, options);
                        fragment.appendChild(state.currentMark);
                        const insideText = text.slice(pos);
                        state.currentMark.appendChild(document.createTextNode(insideText));
                        pos = text.length;
                        if (nextMatch.end <= textEnd) {
                            state.currentMatch = null;
                            state.currentMark = null;
                            state.currentMatchIndex++;
                        }
                    } else {
                        const splitPoint = nextMatch.start - textStart;
                        fragment.appendChild(document.createTextNode(text.slice(pos, splitPoint)));
                        pos = splitPoint;
                        state.currentMatch = nextMatch;
                        state.currentMark = createMarkElement(nextMatch.matchText, options);
                        fragment.appendChild(state.currentMark);
                        const overlapEnd = Math.min(text.length, nextMatch.end - textStart);
                        const insideText = text.slice(pos, overlapEnd);
                        state.currentMark.appendChild(document.createTextNode(insideText));
                        pos = overlapEnd;
                        if (nextMatch.end <= textEnd) {
                            state.currentMatch = null;
                            state.currentMark = null;
                            state.currentMatchIndex++;
                        }
                    }
                }
            }
        }
        state.currentIndex = textEnd;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        let targetFragment = fragment;
        if (state.currentMark) {
            const clonedElement = node.cloneNode(false);
            state.currentMark.appendChild(clonedElement);
            targetFragment = clonedElement;
        } else {
            const clonedElement = node.cloneNode(false);
            fragment.appendChild(clonedElement);
            targetFragment = clonedElement;
        }
        for (const child of Array.from(node.childNodes)) {
            processSubtree(child, targetFragment, fragment, matches, state, options);
        }
    }
}

/**
 * Recursively processes a DOM node based on its type.
 *
 * @param node - The DOM node to process.
 * @param options - Configuration options.
 */
export async function processNode(node: Node, options: Options = { modern: false, includeSpaces: false }) {
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
