console.log(" 🍎 ->->-> Hello from content script")

let targetLanguageFromStorage = "English"
let nativeLanguageFromStorage = "English"

chrome.storage.sync.get(["targetLanguage", "nativeLanguage"], (result) => {
  targetLanguageFromStorage = result.targetLanguage
  nativeLanguageFromStorage = result.nativeLanguage
  if (targetLanguageFromStorage) {
    console.log(`Language from storage: ${targetLanguageFromStorage}`)
    console.log(`Native language from storage: ${nativeLanguageFromStorage}`)
  } else {
    console.log("No language found in storage")
    console.log(`Native language from storage: ${nativeLanguageFromStorage}`)
  }
})

window.hasLingolin = true // Global variable
// OR: inject a hidden element
document.body.appendChild(
  Object.assign(document.createElement("div"), { id: "lingolin-marker" })
)

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data.type !== "LINGOLIN_USER_ID") return
  // Send message to background script instead of directly using chrome.storage
  chrome.runtime.sendMessage({
    type: "LINGOLIN_USER_ID",
    data: event.data.data,
  })
  console.log(" 🍎 ->->-> SENT to background:", event.data)
})
