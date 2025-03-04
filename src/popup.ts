document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle") as HTMLInputElement;
    const modernToggle = document.getElementById("modernToggle") as HTMLInputElement;
    const includeGamutsToggle = document.getElementById("includeGamutsToggle") as HTMLInputElement;

    chrome.storage.sync.get({ enabled: true, modern: false, includeGamuts: false }, (result) => {
        toggle.checked = result.enabled;
        modernToggle.checked = result.modern;
        includeGamutsToggle.checked = result.includeGamuts;
        modernToggle.disabled = !toggle.checked;
        includeGamutsToggle.disabled = !toggle.checked;
    });

    toggle.addEventListener("change", () => {
        chrome.storage.sync.set({ enabled: toggle.checked });
        modernToggle.disabled = !toggle.checked;
        includeGamutsToggle.disabled = !toggle.checked;
    });

    modernToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ modern: modernToggle.checked });
    });

    includeGamutsToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ includeGamuts: includeGamutsToggle.checked });
    });
});
