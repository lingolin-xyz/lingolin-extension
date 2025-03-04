const USE_PROD = true

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
    max-width: 580px;
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
      textSpan.textContent = "Translate [T]"
      textSpan.style.fontSize = "14px"
      textSpan.style.fontFamily = "Grandstander"
      translateButton.appendChild(textSpan)
    })
    .catch((error) => {
      console.error("Error loading SVG:", error)
      translateButton.textContent = "Translate [T]" // Fallback to text-only
    })

  translateButton.addEventListener("click", async () => {
    const selectedText = window.getSelection()?.toString().trim()
    if (selectedText) {
      // Add length validation
      if (
        selectedText.length > 1000 ||
        selectedText.split(/\s+/).length > 200
      ) {
        textContainer.innerHTML = `
          <div style="color: #ff6666;">The text is too long. Please select a text of maximum 200 words or 1K characters.</div>
        `
        return
      }

      const { nativeLanguage, targetLanguage, userData } =
        await readSessionValues()

      if (!userData) {
        textContainer.innerHTML = `
          <div style="color: yellow;">Please <a href="https://www.lingolin.xyz/" target="_blank" style="color: #10B981; text-decoration: underline;">login</a> to use the translation feature</div>
        `
        translateButton.disabled = true
        return
      }

      if (!nativeLanguage || !targetLanguage) {
        textContainer.innerHTML = `
          <div style="color: yellow;">Please select a language in the settings</div>
        `
        translateButton.disabled = true
        return
      }

      // Save the original button content
      const originalButtonContent = translateButton.innerHTML

      // Immediately replace button content with a temporary loading indicator
      translateButton.innerHTML =
        '<span style="font-size: 14px;">Loading...</span>'
      translateButton.disabled = true

      // Load and add the spinner SVG
      fetch(chrome.runtime.getURL("spinner-icon.svg"))
        .then((response) => response.text())
        .then(async (svgText) => {
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
          textSpan.style.fontFamily = "Grandstander"
          textSpan.style.marginLeft = "5px"
          translateButton.appendChild(textSpan)

          try {
            const response = await fetch(
              USE_PROD
                ? "https://www.lingolin.xyz/api/v1/translate"
                : "http://localhost:3000/api/v1/translate",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: userData.id,
                  text: selectedText,
                  nativeLanguage: nativeLanguage,
                  targetLanguage: targetLanguage,
                }),
              }
            )

            const data = await response.json()

            if (data.translatedMessage) {
              textContainer.innerHTML = `
                    <div style="font-size: 19px; color: yellow; font-style: italic; margin-bottom: 2px;">${
                      selectedText.length > 100
                        ? selectedText.slice(0, 100) + "..."
                        : selectedText
                    }</div>
                    <div style="font-size: 14px; color: #cccccc; margin-bottom: 8px;">Translation in ${
                      data.targetLanguage
                    }</div>
                    <div>${data.translatedMessage}</div>
                  `

              // Replace translate button with More and Copy buttons
              buttonContainer.innerHTML = ""

              // Add More button
              const moreButton = document.createElement("button")
              moreButton.style.cssText =
                translateButton.style.cssText +
                `
                transition: border-color 0.2s ease;
              `
              moreButton.addEventListener("mouseover", () => {
                moreButton.style.borderColor = "#10B981"
              })
              moreButton.addEventListener("mouseout", () => {
                moreButton.style.borderColor = "yellow"
              })

              fetch(chrome.runtime.getURL("openai-icon.svg"))
                .then((response) => response.text())
                .then((svgText) => {
                  const parser = new DOMParser()
                  const svgDoc = parser.parseFromString(
                    svgText,
                    "image/svg+xml"
                  )
                  const svgElement = svgDoc.documentElement
                  svgElement.setAttribute("height", "18px")
                  svgElement.setAttribute("width", "18px")
                  svgElement.setAttribute(
                    "style",
                    "transform: translateY(-2px)"
                  )
                  svgElement.style.color = "yellow"

                  moreButton.appendChild(svgElement)
                  const textSpan = document.createElement("span")
                  textSpan.textContent = "More"
                  textSpan.style.fontSize = "14px"
                  textSpan.style.fontFamily = "Grandstander"
                  moreButton.appendChild(textSpan)
                })

              moreButton.addEventListener("click", () => {
                // TODO: Add your external website URL here
                const textToAskChatGPT = `Please explain to me this translation. I am learning ${data.targetLanguage} and my native language is ${nativeLanguage}).
                
<TextISelectedToTranslate>
${selectedText}
</TextISelectedToTranslate>        
        
<TranslationOutput>
${data.translatedMessage}
</TranslationOutput>

Please explain to me the key parts of the translation. Explain it to me in **${nativeLanguage}** because that's my native language.

Thank you and LFG!`
                window.open(
                  `https://chatgpt.com/?q=${encodeURIComponent(
                    textToAskChatGPT
                  )}`,
                  "_blank"
                )
              })

              // Add Copy button with icon
              const copyButton = document.createElement("button")
              copyButton.style.cssText =
                translateButton.style.cssText +
                `
                transition: border-color 0.2s ease;
              `
              copyButton.addEventListener("mouseover", () => {
                copyButton.style.borderColor = "#10B981"
              })
              copyButton.addEventListener("mouseout", () => {
                copyButton.style.borderColor = "yellow"
              })

              fetch(chrome.runtime.getURL("copy-icon.svg"))
                .then((response) => response.text())
                .then((svgText) => {
                  const parser = new DOMParser()
                  const svgDoc = parser.parseFromString(
                    svgText,
                    "image/svg+xml"
                  )
                  const svgElement = svgDoc.documentElement
                  svgElement.setAttribute("height", "18px")
                  svgElement.setAttribute("width", "18px")
                  svgElement.setAttribute(
                    "style",
                    "transform: translateY(-2px)"
                  )
                  svgElement.style.color = "yellow"

                  copyButton.appendChild(svgElement)
                  const textSpan = document.createElement("span")
                  textSpan.textContent = "Copy"
                  textSpan.style.fontSize = "14px"
                  textSpan.style.fontFamily = "Grandstander"
                  copyButton.appendChild(textSpan)
                })

              copyButton.addEventListener("click", () => {
                navigator.clipboard
                  .writeText(data.translatedMessage)
                  .then(() => {
                    const textSpan = copyButton.querySelector("span")
                    const originalText = textSpan.textContent
                    textSpan.textContent = "Copied!"
                    textSpan.style.color = "oklch(0.765 0.177 163.223)"
                    setTimeout(() => {
                      textSpan.textContent = originalText
                      textSpan.style.color = "yellow"
                    }, 500)
                  })
              })

              buttonContainer.appendChild(moreButton)
              buttonContainer.appendChild(copyButton)
            } else {
              textContainer.innerHTML = `
                <div style="color: #ff6666;">Translation failed. Please try again.</div>
                <div style="font-size: 18px; margin-top: 8px;">${selectedText}</div>
              `
            }
          } catch (error) {
            console.error("Translation error:", error)
            textContainer.innerHTML = `
              <div style="color: #ff6666;">Translation failed. Please try again.</div>
              <div style="font-size: 18px; margin-top: 8px;">${selectedText}</div>
            `
          } finally {
            // This code always runs, whether there was an error or not
            translateButton.innerHTML = originalButtonContent
            translateButton.disabled = false
          }
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

  // Add buttons to button container
  buttonContainer.appendChild(translateButton)
  // buttonContainer.appendChild(copyButton)

  // Add containers to modal
  modal.appendChild(textContainer)
  modal.appendChild(buttonContainer)

  // Add modal to wrapper and wrapper to document
  wrapper.appendChild(modal)
  document.body.appendChild(wrapper)

  // Add keyboard shortcut listener
  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "t") {
      const selectedText = window.getSelection()?.toString().trim()
      if (selectedText) {
        translateButton.click()
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }
  })

  // Listen for text selection changes
  document.addEventListener("selectionchange", () => {
    const selectedText = window.getSelection()?.toString().trim()

    if (selectedText) {
      // Show modal with selected text
      wrapper.style.display = "flex"

      // Reset banner to initial state
      textContainer.textContent =
        selectedText.length > MAX_TEXT_LENGTH
          ? selectedText.slice(0, MAX_TEXT_LENGTH) + "..."
          : selectedText

      // Reset button container to only show translate button
      buttonContainer.innerHTML = ""
      buttonContainer.appendChild(translateButton)

      // Re-enable translate button if it was disabled
      translateButton.disabled = false
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
}

initSelectionBanner()

const readSessionValues = async () => {
  const {
    nativeLanguage,
    targetLanguage,
    "lingolin-message": userData,
  } = await chrome.storage.sync.get([
    "nativeLanguage",
    "targetLanguage",
    "lingolin-message",
  ])

  return {
    nativeLanguage,
    targetLanguage,
    userData: userData
      ? JSON.parse(userData).id
        ? JSON.parse(userData)
        : false
      : false,
  }
}
