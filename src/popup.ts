import { processNode } from "./utils";

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle") as HTMLInputElement;
    const modernToggle = document.getElementById("modernToggle") as HTMLInputElement;
    const includeSpacesToggle = document.getElementById("includeSpacesToggle") as HTMLInputElement;

    chrome.storage.sync.get({ enabled: true, modern: false, includeSpaces: false }, (result) => {
        toggle.checked = result.enabled;
        modernToggle.checked = result.modern;
        includeSpacesToggle.checked = result.includeSpaces;
        modernToggle.disabled = !toggle.checked;
        includeSpacesToggle.disabled = !toggle.checked;

        processNode(document.body, { modern: true, includeSpaces: true });
    });

    toggle.addEventListener("change", () => {
        chrome.storage.sync.set({ enabled: toggle.checked });
        modernToggle.disabled = !toggle.checked;
        includeSpacesToggle.disabled = !toggle.checked;
    });

    modernToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ modern: modernToggle.checked });
    });

    includeSpacesToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ includeSpaces: includeSpacesToggle.checked });
    });
});
