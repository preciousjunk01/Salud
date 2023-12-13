chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url === "https://www.walmart.com/cart") {
        console.log("Ullen iyya");
        // Example message sending:
        chrome.tabs.sendMessage(tabId, {greeting: "hello"});
    }
});
