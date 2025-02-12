document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle") as HTMLInputElement;
    const modernToggle = document.getElementById("modernToggle") as HTMLInputElement;

    chrome.storage.sync.get({ enabled: true, modern: false }, (result) => {
        toggle.checked = result.enabled;
        modernToggle.checked = result.modern;
        modernToggle.disabled = !toggle.checked;
    });

    toggle.addEventListener("change", () => {
        chrome.storage.sync.set({ enabled: toggle.checked });
        modernToggle.disabled = !toggle.checked;
    });

    modernToggle.addEventListener("change", () => {
        chrome.storage.sync.set({ modern: modernToggle.checked });
    });
});
