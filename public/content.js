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
  display: flex;
  flex-direction: column;
  gap: 10px;
`
modal.id = "selection-modal"

// Create text container
const textContainer = document.createElement("div")
textContainer.id = "selection-text-container"

// Create button container
const buttonContainer = document.createElement("div")
buttonContainer.style.cssText = `
  display: flex;
  justify-content: space-around;
  border-top: 1px solid yellow;
  padding-top: 10px;
`

// Create Translate button
const translateButton = document.createElement("button")
translateButton.style.cssText = `
  background-color: black;
  color: yellow;
  border: 1px solid yellow;
  border-radius: 6px;
  padding: 5px 15px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
`

// Create and add the SVG icon
fetch(chrome.runtime.getURL("translate-icon.svg"))
  .then((response) => response.text())
  .then((svgText) => {
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
    const svgElement = svgDoc.documentElement

    // Adjust SVG size
    svgElement.setAttribute("height", "20px")
    svgElement.setAttribute("width", "20px")

    // Set SVG color to match button text
    svgElement.style.color = "yellow"

    translateButton.appendChild(svgElement)

    // Add text after the icon
    const textSpan = document.createElement("span")
    textSpan.textContent = "Translate"
    translateButton.appendChild(textSpan)
  })
  .catch((error) => {
    console.error("Error loading SVG:", error)
    translateButton.textContent = "Translate" // Fallback to text-only
  })

translateButton.addEventListener("click", () => {
  const selectedText = window.getSelection()?.toString().trim()
  if (selectedText) {
    // TODO: Implement translation functionality
    console.log("Translate:", selectedText)
  }
})

// Create Copy button
const copyButton = document.createElement("button")
copyButton.style.cssText = `
  background-color: black;
  color: yellow;
  border: 1px solid yellow;
  border-radius: 6px;
  padding: 5px 15px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
`

// Create and add the SVG icon
fetch(chrome.runtime.getURL("copy-icon.svg"))
  .then((response) => response.text())
  .then((svgText) => {
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
    const svgElement = svgDoc.documentElement

    // Adjust SVG size
    svgElement.setAttribute("height", "20px")
    svgElement.setAttribute("width", "20px")

    // Set SVG color to match button text
    svgElement.style.color = "yellow"

    copyButton.appendChild(svgElement)

    // Add text after the icon
    const textSpan = document.createElement("span")
    textSpan.textContent = "Copy to clipboard"
    copyButton.appendChild(textSpan)
  })
  .catch((error) => {
    console.error("Error loading SVG:", error)
    copyButton.textContent = "Copy to clipboard" // Fallback to text-only
  })

copyButton.addEventListener("click", () => {
  const selectedText = window.getSelection()?.toString().trim()
  if (selectedText) {
    navigator.clipboard
      .writeText(selectedText)
      .then(() => {
        // Optional: Show feedback that text was copied
        const originalText = copyButton.querySelector("span").textContent
        copyButton.querySelector("span").textContent = "Copied!"
        setTimeout(() => {
          copyButton.querySelector("span").textContent = originalText
        }, 1500)
      })
      .catch((err) => console.error("Failed to copy text: ", err))
  }
})

// Add buttons to button container
buttonContainer.appendChild(translateButton)
buttonContainer.appendChild(copyButton)

// Add containers to modal
modal.appendChild(textContainer)
modal.appendChild(buttonContainer)

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
    textContainer.textContent =
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
