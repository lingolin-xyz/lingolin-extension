chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINGOLIN_USER_ID") {
    console.log(" 🍎 ->->->-> Background received:", message.data)
    // Store the data in chrome.storage.sync
    chrome.storage.sync.set({ "lingolin-message": message.data }, () => {
      console.log(" 🍎 ->->->-> Saved to storage:", message.data)
    })
    chrome.runtime.sendMessage({ type: "NOTIFY_POPUP", data: message.data })
  }
})
