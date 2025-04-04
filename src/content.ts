import { processNode } from "./utils";

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
        } else if (newModern !== null || newIncludeSpaces !== null) {
            window.location.reload();
        }
    }
});
