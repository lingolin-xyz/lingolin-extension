let isRecording = false
let isAnimatingRecordingIndicator = false
let mediaRecorder = null

document.addEventListener("keydown", async (event) => {
  if (event.shiftKey && event.key === "M") {
    console.log("DENTRO DE LA COSAAAA")

    const { nativeLanguage, targetLanguage, userData } =
      await readSessionValues()

    if (!userData) {
      alert("Please login to use this feature")
      return
    }
    if (!nativeLanguage || !targetLanguage) {
      alert("Please select a language to use this feature")
      return
    }

    if (!isRecording && !isAnimatingRecordingIndicator) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder = new MediaRecorder(stream)
          let chunks = []

          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data)
          }

          mediaRecorder.onstop = async () => {
            const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" })
            chunks = []

            const formData = new FormData()
            formData.append("audio", blob, "recording.ogg")
            formData.append("nativeLanguage", nativeLanguage)
            formData.append("targetLanguage", targetLanguage)
            formData.append("userId", userData.id)

            try {
              const response = await fetch(
                "http://localhost:3000/api/v2/audio-in",
                {
                  method: "POST",
                  body: formData,
                }
              )

              const data = await response.json()
              console.log("Audio procesado:", data)

              // Create and show the results panel
              const resultsPanel = document.createElement("div")
              resultsPanel.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                border: 2px solid yellow;
                border-radius: 12px;
                width: 100%;
                max-width: 500px;
                background-color: black;
                color: yellow;
                padding: 10px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                font-family: 'Grandstander', sans-serif;
                z-index: 999999999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
              `

              resultsPanel.innerHTML = `
                <div>${data.transcription}</div>
              `

              const topBannerResultContainer = document.createElement("div")

              document.body.appendChild(resultsPanel)

              putTextWithSpearkerButton({
                theTranslation: data.translatedMessage,
                panelToPlaceIt: topBannerResultContainer,
              })

              resultsPanel.appendChild(topBannerResultContainer)

              // hide this panel if user clicks anywhere outside of it:
              document.addEventListener("click", (event) => {
                if (
                  !resultsPanel.contains(event.target) &&
                  !event.target.closest("#results-panel")
                ) {
                  resultsPanel.style.display = "none"
                }
              })

              const audioURL = URL.createObjectURL(blob)
              const audio = new Audio(audioURL)
              audio.play()
            } catch (error) {
              console.error("Error enviando audio:", error)
            }
          }

          // Start recording
          mediaRecorder.start()
          isRecording = true
          isAnimatingRecordingIndicator = true

          // Create recording indicator
          const newCircle = document.createElement("div")
          newCircle.style.position = "fixed"
          newCircle.style.top = "20px"
          newCircle.style.right = "20px"
          newCircle.style.width = "100px"
          newCircle.style.height = "100px"
          newCircle.style.backgroundColor = "yellow"
          newCircle.style.borderRadius = "50%"
          newCircle.style.zIndex = "999999999"
          newCircle.style.boxShadow = "0 0 10px rgba(255, 192, 203, 0.5)"
          newCircle.style.display = "flex"
          newCircle.style.alignItems = "center"
          newCircle.style.justifyContent = "center"
          newCircle.id = "recording-indicator"
          newCircle.style.transform = "scale(0)"

          const img = document.createElement("img")
          img.src = "https://javitoshi.com/images/red-lp.png"
          img.style.width = "80%"
          img.style.height = "80%"
          img.style.objectFit = "contain"
          img.style.animation = "lingolinSpin 4s linear infinite"
          img.style.cursor = "pointer"

          // Click to stop recording
          img.addEventListener("click", () => {
            if (isRecording) {
              isRecording = false
              if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop()
                mediaRecorder.stream
                  .getTracks()
                  .forEach((track) => track.stop())
                mediaRecorder = null
              }
            }
          })

          newCircle.appendChild(img)
          document.body.appendChild(newCircle)
        })
        .catch((err) => {
          console.error("Error al acceder al micrófono:", err)
          isRecording = false
          isAnimatingRecordingIndicator = false
        })
    } else if (isRecording) {
      // Stop recording
      isRecording = false
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop()
        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
        mediaRecorder = null
      }
    }
  }
})

const putTextWithSpearkerButton = ({ theTranslation, panelToPlaceIt }) => {
  const container = document.createElement("div")
  container.style.display = "flex"
  container.style.alignItems = "center"
  container.style.justifyContent = "center"
  container.style.gap = "10px"

  const translationText = document.createElement("span")
  translationText.textContent = theTranslation
  translationText.style.fontSize = "25px"

  const speakerButton = document.createElement("button")
  speakerButton.style.cssText = `
    background: none;
    border: none;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    padding-bottom: 5px;
  `

  const speakerImg = document.createElement("img")
  speakerImg.src = "https://javitoshi.com/images/speaker-sticker-2.png"
  speakerImg.style.width = "100%"
  speakerImg.style.height = "100%"
  speakerImg.style.objectFit = "contain"
  speakerImg.style.opacity = "0.75"
  speakerImg.style.cursor = "pointer"

  speakerButton.addEventListener("click", async () => {
    try {
      speakerImg.style.animation = "lingolinSpin 2s linear infinite"

      const response = await fetch(
        "https://infinitoor.vercel.app/api/text-to-speech",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: theTranslation,
            language: langFromStorage,
          }),
        }
      )

      const data = await response.json()

      speakerImg.style.animation = ""
      speakerImg.src =
        "https://javitoshi.com/images/speaker-sticker-playing-2.png"

      await playAudioWithSpinner({
        audioUrl: data.audio,
        onComplete: () => {
          speakerImg.src = "https://javitoshi.com/images/speaker-sticker-2.png"
        },
      })
    } catch (error) {
      speakerImg.style.animation = ""
      speakerImg.src = "https://javitoshi.com/images/speaker-sticker-2.png"
      console.error("Error generating speech:", error)
    }
  })

  speakerButton.appendChild(speakerImg)
  container.appendChild(translationText)
  container.appendChild(speakerButton)
  panelToPlaceIt.textContent = ""
  panelToPlaceIt.appendChild(container)
}
