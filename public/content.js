console.log(" 🍎 ->->-> Hello from content script")

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
