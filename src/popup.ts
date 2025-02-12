document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("toggle") as HTMLInputElement;

    chrome.storage.sync.get({ enabled: true }, (result) => {
        toggle.checked = result.enabled;
    });

    toggle.addEventListener("change", () => {
        const isEnabled = toggle.checked;
        chrome.storage.sync.set({ enabled: isEnabled });
    });
});
