// Maximum text length for display
const MAX_TEXT_LENGTH = 144

console.log(" 🍎 ->->-> Hello from content script")

// window.addEventListener("message", (event) => {
//   if (event.data?.type === "EXTENSION_CHALLENGE") {
//     // Sign the challenge (use a private key stored in extension)
//     const signature = signChallenge(event.data.challenge)
//     console.log(" 🍎 -> signature", signature)
//     window.postMessage(
//       {
//         type: "EXTENSION_RESPONSE",
//         challenge: event.data.challenge,
//         signature,
//       },
//       "*"
//     )
//   }
// })

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

// Create the modal wrapper
const wrapper = document.createElement("div")
wrapper.style.cssText = `
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: none;
  justify-content: center;
  z-index: 999999999;
`
wrapper.id = "selection-modal-wrapper"

// Create the modal itself
const modal = document.createElement("div")
modal.style.cssText = `
  border: 2px solid yellow;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  background-color: black;
  color: yellow;
  padding: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  user-select: none;
`
modal.id = "selection-modal"

// Add modal to wrapper and wrapper to document
wrapper.appendChild(modal)
document.body.appendChild(wrapper)

// Listen for text selection changes
document.addEventListener("selectionchange", () => {
  const selectedText = window.getSelection()?.toString().trim()

  if (selectedText) {
    // Show modal with selected text
    wrapper.style.display = "flex"

    // Truncate text if too long
    modal.textContent =
      selectedText.length > MAX_TEXT_LENGTH
        ? selectedText.slice(0, MAX_TEXT_LENGTH) + "..."
        : selectedText
  } else {
    // Hide modal when no text is selected
    wrapper.style.display = "none"
  }
})

// Optional: Close modal when clicking outside
document.addEventListener("click", (event) => {
  if (!modal.contains(event.target) && wrapper.style.display === "flex") {
    const selection = window.getSelection()
    if (!selection.toString().trim()) {
      wrapper.style.display = "none"
    }
  }
})
