document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggle');
    

    chrome.storage.sync.get(['enabled'], function(result) {
        toggle.checked = result.enabled !== false;
    });

    toggle.addEventListener('change', function() {
        const enabled = toggle.checked;
        chrome.storage.sync.set({ enabled: enabled });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 
                action: 'toggleEffect', 
                enabled: enabled 
            });
        });
    });
});