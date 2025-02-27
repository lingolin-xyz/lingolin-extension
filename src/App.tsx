import { useEffect, useState } from "react"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200)
  }, [])

  const [lingolinMessage, setLingolinMessage] = useState<any>(null)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "NOTIFY_POPUP") {
        console.log("🍎 ->->->-> Popup received:", message.data)
      }
    })
  }, [])

  useEffect(() => {
    const getLingolinMessage = async () => {
      const { "lingolin-message": result } = await chrome.storage.sync.get(
        "lingolin-message"
      )
      console.log("🍎 ->->->-> Local storage received!!!", result)
      setLingolinMessage(result)
    }
    getLingolinMessage()
  }, [])

  return (
    <div className="w-[500px] h-[500px] bg-purple-300 hello black mx-auto border-2 border-black p-4">
      {/* <UserDebugger /> */}
      {lingolinMessage && (
        <div>
          <pre>{lingolinMessage.message}</pre>
        </div>
      )}

      {isLoading && <div>Loading...</div>}
      <div>YOOOOO!!</div>
    </div>
  )
}

export default App
