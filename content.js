function addShortsCSS() {
    if (!document.getElementById("shorts-css") && window.location.href.includes("youtube.com/shorts")) {
        const style = document.createElement("style");
        style.id = "shorts-css";
        style.innerHTML = `
            .ytReelMetapanelViewModelHost {
                opacity: 0;
                transition: opacity .5s linear;
            }
            .ytReelMetapanelViewModelHost:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

function removeShortsCSS() {
    const style = document.getElementById("shorts-css");
    if (style) {
        style.remove();
    }
}

// Check initial state and apply/remove CSS
chrome.storage.sync.get(['enabled'], function(result) {
    const enabled = result.enabled !== false; // Default to true if not set
    if (enabled) {
        addShortsCSS();
    } else {
        removeShortsCSS();
    }
});

// Listen for toggle changes
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'toggleEffect') {
        if (message.enabled) {
            addShortsCSS();
        } else {
            removeShortsCSS();
        }
    }
});

// Run on URL changes (for YouTube's single-page app behavior)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        chrome.storage.sync.get(['enabled'], function(result) {
            const enabled = result.enabled !== false;
            if (enabled && url.includes("youtube.com/shorts")) {
                addShortsCSS();
            } else {
                removeShortsCSS();
            }
        });
    }
}).observe(document, {subtree: true, childList: true});