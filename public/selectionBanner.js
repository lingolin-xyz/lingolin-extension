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
    background-color: black;
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
    transform: scale(0); /* Start scaled down */
    transform-origin: bottom center; /* Animate from bottom */
    transition: none; /* Disable default transitions */
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
    padding: 5px 15px 0px 15px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 5px;
  `

  fetch(chrome.runtime.getURL("translate-icon.svg"))
    .then((response) => response.text())
    .then((svgText) => {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
      const svgElement = svgDoc.documentElement
      svgElement.setAttribute("height", "20px")
      svgElement.setAttribute("width", "20px")
      svgElement.setAttribute("style", "transform: translateY(-2px)")
      svgElement.style.color = "yellow"
      translateButton.appendChild(svgElement)
      const textSpan = document.createElement("span")
      textSpan.textContent = "Translate"
      textSpan.style.fontSize = "14px"
      translateButton.appendChild(textSpan)
    })
    .catch((error) => {
      console.error("Error loading SVG:", error)
      translateButton.textContent = "Translate"
    })

  translateButton.addEventListener("click", () => {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
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

  fetch(chrome.runtime.getURL("copy-icon.svg"))
    .then((response) => response.text())
    .then((svgText) => {
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml")
      const svgElement = svgDoc.documentElement
      svgElement.setAttribute("height", "20px")
      svgElement.setAttribute("width", "20px")
      svgElement.setAttribute("style", "transform: translateY(-2px)")
      svgElement.style.color = "yellow"
      copyButton.appendChild(svgElement)
      const textSpan = document.createElement("span")
      textSpan.textContent = "Copy to clipboard"
      textSpan.style.fontSize = "14px"
      copyButton.appendChild(textSpan)
    })
    .catch((error) => {
      console.error("Error loading SVG:", error)
      copyButton.textContent = "Copy to clipboard"
    })

  copyButton.addEventListener("click", () => {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
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

  // Spring Animation Function
  function springAnimation({
    from,
    to,
    stiffness = 0.1,
    damping = 0.85,
    onUpdate,
    onComplete,
  }) {
    let current = from
    let velocity = 0

    function animate() {
      const force = (to - current) * stiffness
      velocity = (velocity + force) * damping
      current += velocity

      onUpdate(current)

      if (Math.abs(to - current) < 0.01 && Math.abs(velocity) < 0.01) {
        onUpdate(to)
        if (onComplete) onComplete()
      } else {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }

  // Listen for text selection changes
  let lastSelectedText = ""

  document.addEventListener("selectionchange", () => {
    const selectedText = window.getSelection()?.toString().trim()

    // Only proceed if the selection has actually changed
    if (selectedText === lastSelectedText) {
      return
    }

    lastSelectedText = selectedText

    if (selectedText) {
      // Show wrapper and animate modal in
      wrapper.style.display = "flex"
      textContainer.textContent =
        selectedText.length > MAX_TEXT_LENGTH
          ? selectedText.slice(0, MAX_TEXT_LENGTH) + "..."
          : selectedText

      springAnimation({
        from: 0, // Start from scale 0
        to: 1, // End at scale 1
        stiffness: 0.1,
        damping: 0.85,
        onUpdate: (scale) => {
          modal.style.transform = `scale(${scale})`
        },
        onComplete: () => {
          console.log("Modal animation in completed")
        },
      })
    } else {
      // Only hide if there's no selection
      springAnimation({
        from: 1, // Start from scale 1
        to: 0, // End at scale 0
        stiffness: 0.1,
        damping: 0.85,
        onUpdate: (scale) => {
          modal.style.transform = `scale(${scale})`
        },
        onComplete: () => {
          wrapper.style.display = "none"
          console.log("Modal animation out completed")
        },
      })
    }
  })

  // Optional: Close modal when clicking outside
  document.addEventListener("click", (event) => {
    if (!modal.contains(event.target) && wrapper.style.display === "flex") {
      const selection = window.getSelection()
      // Only close if there's no selection or if the click was outside the selected text
      if (!selection.toString().trim()) {
        lastSelectedText = "" // Reset the last selected text
        springAnimation({
          from: 1,
          to: 0,
          stiffness: 0.1,
          damping: 0.85,
          onUpdate: (scale) => {
            modal.style.transform = `scale(${scale})`
          },
          onComplete: () => {
            wrapper.style.display = "none"
          },
        })
      }
    }
  })
}

console.log("hello from selection banner!!! 💛 💛 💛 💛 ")

initSelectionBanner()
