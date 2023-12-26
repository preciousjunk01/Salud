let lastExecutionTime = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes("https://www.walmart.com/cart")) {
        const now = Date.now();

        // Throttle to run at most once per minute
        if (!lastExecutionTime[tabId] || (now - lastExecutionTime[tabId] > 60000)) {
            lastExecutionTime[tabId] = now;

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['dist/bundle.js']
            });
        }
    }
});