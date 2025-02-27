console.log(" 🍎 ->->-> Hello from content script")

window.hasLingolin = true // Global variable
// OR: inject a hidden element
document.body.appendChild(
  Object.assign(document.createElement("div"), { id: "lingolin-marker" })
)

let LOGGED_IN_USED_ID = false

window.addEventListener("message", (event) => {
  if (event.source !== window || event.data.type !== "LINGOLIN_USER_ID") return
  // Send message to background script instead of directly using chrome.storage
  chrome.runtime.sendMessage({
    type: "LINGOLIN_USER_ID",
    data: event.data.data,
  })
  LOGGED_IN_USED_ID = event.data.data.id
  console.log(" 🍎 ->->-> SENT to background:", event.data)
  console.log(" 🍎 ->->-> SAVED as a var: " + LOGGED_IN_USED_ID)
})
