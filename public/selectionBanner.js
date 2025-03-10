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
          <div style="color: yellow;">Please <a href="https://app.lingolin.xyz/" target="_blank" style="color: #10B981; text-decoration: underline;">login</a> to use the translation feature</div>
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

          svgElement.setAttribute("height", "18px")
          svgElement.setAttribute("width", "18px")
          svgElement.style.color = "yellow"
          svgElement.style.animation = "spin 1s linear infinite"

          if (!document.querySelector("#spinner-keyframes")) {
            const style = document.createElement("style")
            style.id = "spinner-keyframes"
            style.textContent = `
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `
            document.head.appendChild(style)
          }

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
              "https://app.lingolin.xyz/api/v1/translate",
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

                    <div id="translation-with-speaker" style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                      <span style="font-size: 24px;">${
                        data.translatedMessage
                      }</span>
                      <button id="speaker-button" style="background: none; border: none; min-width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; padding-bottom: 5px;">
                        <img src="https://javitoshi.com/images/speaker-sticker-2.png" style="width: 100%; height: 100%; object-fit: contain; opacity: 0.75; cursor: pointer;">
                      </button>
                    </div>
                  `

              // Add speaker button functionality
              const speakerButton = document.getElementById("speaker-button")
              if (speakerButton) {
                speakerButton.addEventListener("click", async () => {
                  try {
                    const { targetLanguage, userData } =
                      await readSessionValues()
                    const speakerImg = speakerButton.querySelector("img")

                    // Add rotation animation while processing
                    speakerImg.style.animation =
                      "speakerRotate 2s linear infinite"

                    const response = await fetch(
                      `${"https://app.lingolin.xyz"}/api/v2/text-to-speech`,
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          message: data.translatedMessage,
                          language: targetLanguage,
                          userId: userData.id,
                        }),
                      }
                    )

                    const audioData = await response.json()

                    // Stop the rotation animation
                    speakerImg.style.animation = ""
                    speakerImg.src =
                      "https://javitoshi.com/images/speaker-sticker-playing-2.png"

                    await playAudioWithSpinner({
                      audioUrl: audioData.audio,
                      onComplete: () => {
                        speakerImg.style.animation = ""
                        speakerImg.src =
                          "https://javitoshi.com/images/speaker-sticker-2.png"
                      },
                    })
                  } catch (error) {
                    const speakerImg = speakerButton.querySelector("img")
                    speakerImg.style.animation = ""
                    speakerImg.src =
                      "https://javitoshi.com/images/speaker-sticker-2.png"
                    console.error("Error generating speech:", error)
                  }
                })
              }

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
                const textToAskChatGPT = `Please explain to me this translation. I am learning ${targetLanguage} and my native language is ${nativeLanguage}).
                
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
    if (event && event.key && event.key.toLowerCase() === "t") {
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

  // Add the CSS animation for speaker rotation if it doesn't exist
  if (!document.getElementById("speaker-animation-style")) {
    const style = document.createElement("style")
    style.id = "speaker-animation-style"
    style.textContent = `
      @keyframes speakerRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes lingolinSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)
  }

  // Add the springAnimation function if it doesn't exist in this file
  function springAnimation({
    from,
    to,
    stiffness = 0.2,
    damping = 0.8,
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

  // Add the playAudioWithSpinner function
  const playAudioWithSpinner = async ({ audioUrl, onComplete }) => {
    // Create spinning image container
    const spinContainer = document.createElement("div")
    spinContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 100px;
      height: 100px;
      z-index: 999999999;
      transform: scale(0);
    `

    const spinImg = document.createElement("img")
    spinImg.src = "https://javitoshi.com/images/yellow-lp.png"
    spinImg.style.cssText = `
      width: 80%;
      height: 80%;
      object-fit: contain;
      animation: lingolinSpin 4s linear infinite;
    `

    spinContainer.appendChild(spinImg)
    document.body.appendChild(spinContainer)

    // Animate in
    springAnimation({
      from: 0,
      to: 1,
      stiffness: 0.2,
      damping: 0.8,
      onUpdate: (scale) => {
        spinContainer.style.transform = `scale(${scale})`
      },
    })

    // Create and play audio
    let audioElement = null

    try {
      audioElement = new Audio(audioUrl)

      // Add error handling for the audio element
      audioElement.onerror = (e) => {
        console.error("Audio error:", e)
        if (document.body.contains(spinContainer)) {
          document.body.removeChild(spinContainer)
        }
        window.open(audioUrl, "_blank")
      }

      audioElement.play()

      // Reset when audio ends
      audioElement.onended = () => {
        springAnimation({
          from: 1,
          to: 0,
          stiffness: 0.3,
          damping: 0.7,
          onUpdate: (scale) => {
            spinContainer.style.transform = `scale(${scale})`
          },
          onComplete: () => {
            if (document.body.contains(spinContainer)) {
              document.body.removeChild(spinContainer)
            }
            if (onComplete) onComplete()
          },
        })
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      if (document.body.contains(spinContainer)) {
        document.body.removeChild(spinContainer)
      }
      window.open(audioUrl, "_blank")
    }

    return {
      stop: () => {
        if (audioElement) {
          audioElement.pause()
        }
        if (document.body.contains(spinContainer)) {
          document.body.removeChild(spinContainer)
        }
      },
    }
  }
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
