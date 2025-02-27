// Maximum text length for display
const MAX_TEXT_LENGTH = 144

function initSelectionBanner() {
  // Inject Google Font
  if (
    !document.querySelector(
      'link[href*="fonts.googleapis.com/css2?family=Grandstaner"]'
    )
  ) {
    const link = document.createElement("link")
    link.href =
      "https://fonts.googleapis.com/css2?family=Grandstander:ital,wght@0,100..900;1,100..900&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
  }

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
    background-color: #000000aa;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    
    color: yellow;
    padding: 10px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    font-family: 'Grandstander', sans-serif;
    user-select: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
  `
  modal.id = "selection-modal"

  // Create text container
  const textContainer = document.createElement("div")
  textContainer.id = "selection-text-container"
  textContainer.style.fontSize = "24px"
  textContainer.style.padding = "12px"

  // Create button container
  const buttonContainer = document.createElement("div")
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 2px;
    padding-bottom: 2px;
  `

  // Create Translate button
  const translateButton = document.createElement("button")
  translateButton.style.cssText = `
    background-color: black;
    color: yellow;
    border: 1px solid yellow;
    border-radius: 6px;
    padding: 5px 15px 2px 15px;
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
      svgElement.setAttribute("height", "18px")
      svgElement.setAttribute("width", "18px")
      svgElement.setAttribute("style", "transform: translateY(-2px)")

      // Set SVG color to match button text
      svgElement.style.color = "yellow"

      translateButton.appendChild(svgElement)

      // Add text after the icon
      const textSpan = document.createElement("span")
      textSpan.textContent = "Translate"
      textSpan.style.fontSize = "14px"
      translateButton.appendChild(textSpan)
    })
    .catch((error) => {
      console.error("Error loading SVG:", error)
      translateButton.textContent = "Translate" // Fallback to text-only
    })

  translateButton.addEventListener("click", () => {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
      // Save the original button content
      const originalButtonContent = translateButton.innerHTML

      // Immediately replace button content with a temporary loading indicator
      translateButton.innerHTML =
        '<span style="font-size: 14px;">Loading...</span>'
      translateButton.disabled = true

      // Load and add the spinner SVG
      fetch(chrome.runtime.getURL("spinner-icon.svg"))
        .then((response) => response.text())
        .then((svgText) => {
          const parser = new DOMParser()
          const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
          const svgElement = svgDoc.documentElement

          // Adjust SVG size and color
          svgElement.setAttribute("height", "18px")
          svgElement.setAttribute("width", "18px")
          svgElement.style.color = "yellow"

          // Clear the temporary loading text and add the spinner
          translateButton.innerHTML = ""
          translateButton.appendChild(svgElement)

          // Add "Loading..." text
          const textSpan = document.createElement("span")
          textSpan.textContent = "translating..."
          textSpan.style.fontSize = "14px"
          textSpan.style.marginLeft = "5px"
          translateButton.appendChild(textSpan)

          // Simulate backend call with 3-second delay
          setTimeout(() => {
            // TODO: Implement actual translation functionality
            console.log("Translate:", selectedText)

            // Restore original button content
            translateButton.innerHTML = originalButtonContent
            translateButton.disabled = false
          }, 3000)
        })
        .catch((error) => {
          console.error("Error loading spinner SVG:", error)
          translateButton.textContent = "Loading..." // Fallback

          // Simulate backend call with 3-second delay
          setTimeout(() => {
            // Restore original button content
            translateButton.innerHTML = originalButtonContent
            translateButton.disabled = false
          }, 3000)
        })
    }
  })

  // Create Copy button
  const copyButton = document.createElement("button")
  copyButton.style.cssText = `
    background-color: black;
    color: yellow;
    border: 1px solid yellow;
    border-radius: 6px;
    padding: 5px 15px 2px 15px;
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
      svgElement.setAttribute("height", "18px")
      svgElement.setAttribute("width", "18px")
      svgElement.setAttribute("style", "transform: translateY(-2px)")

      // Set SVG color to match button text
      svgElement.style.color = "yellow"

      copyButton.appendChild(svgElement)

      // Add text after the icon
      const textSpan = document.createElement("span")
      textSpan.textContent = "Copy to Clipboard"
      textSpan.style.fontSize = "14px"
      copyButton.appendChild(textSpan)

      copyButton.addEventListener("click", () => {
        const selectedText = window.getSelection()?.toString().trim()
        if (selectedText) {
          navigator.clipboard
            .writeText(selectedText)
            .then(() => {
              const originalText = textSpan.textContent
              textSpan.textContent = "Copied!"
              textSpan.style.color = "oklch(0.765 0.177 163.223)"
              setTimeout(() => {
                textSpan.textContent = originalText
                textSpan.style.color = "yellow"
              }, 500)
            })
            .catch((err) => console.error("Failed to copy:", err))
        }
      })
    })
    .catch((error) => {
      console.error("Error loading SVG:", error)
      copyButton.textContent = "Copy to Clipboard fallback" // Fallback to text-only
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

  // Optional: Close modal when clicking outside
  document.addEventListener("click", (event) => {
    if (!modal.contains(event.target) && wrapper.style.display === "flex") {
      const selection = window.getSelection()
      if (!selection.toString().trim()) {
        wrapper.style.display = "none"
      }
    }
  })
}

console.log("hello from selection banner!!! 💛 💛 💛 💛 ")

initSelectionBanner()
