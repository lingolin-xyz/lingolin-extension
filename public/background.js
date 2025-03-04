chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINGOLIN_USER_ID") {
    // Store the data in chrome.storage.sync
    chrome.storage.sync.set(
      { "lingolin-message": JSON.stringify(message.data) },
      () => {}
    )
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url || tab.url) {
    updateIcon(tab.url)
  }
})

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  let tab = await chrome.tabs.get(activeInfo.tabId)
  updateIcon(tab.url)
})

function updateIcon(url) {
  if (!url) {
    console.log("No URL provided")
    return
  }

  // Add more robust URL checking
  try {
    const urlObj = new URL(url)
    console.log("Valid URL:", urlObj.hostname)

    if (urlObj.hostname === "localhost" || urlObj.hostname === "127.0.0.1") {
      chrome.action.setIcon({
        path: {
          16: "icons/localicon16.png",
          48: "icons/localicon48.png",
          128: "icons/localicon128.png",
        },
      })
    } else {
      chrome.action.setIcon({
        path: {
          16: "icons/icon16.png",
          48: "icons/icon48.png",
          128: "icons/icon128.png",
        },
      })
    }
  } catch (e) {
    console.error("Invalid URL:", url, e)
  }
}
