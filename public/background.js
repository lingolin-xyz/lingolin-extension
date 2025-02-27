chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINGOLIN_MESSAGE") {
    console.log(" 🍎 ->->->-> Background received:", message.data)
    chrome.runtime.sendMessage({ type: "NOTIFY_POPUP", data: message.data })
  }
})
