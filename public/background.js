chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINGOLIN_USER_ID") {
    // Store the data in chrome.storage.sync
    chrome.storage.sync.set(
      { "lingolin-message": JSON.stringify(message.data) },
      () => {}
    )
  }
})
