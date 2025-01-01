chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "commentsHierarchy") {
    console.log("Received comments hierarchy:", message.data);
    sendResponse({ success: true });
  }
});
