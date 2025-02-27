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
