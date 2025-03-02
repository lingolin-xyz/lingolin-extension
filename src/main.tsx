import React from "react"
import ReactDOM from "react-dom/client"

import "./index.css"

import App from "./App"
const root = document.getElementById("root")
if (!root) {
  throw new Error("Root element not found")
}
// root quiero que sea w-full h-full
root.style.width = "100%"
root.style.minHeight = "100%"
// display flex flexco center
root.style.display = "flex"
root.style.justifyContent = "center"
root.style.alignItems = "center"
const rootElement = ReactDOM.createRoot(root)

rootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
