import { useEffect, useState } from "react"

// interface ChromeMessage {
//   type: string
//   data: LingolinMessage
// }

interface LingolinMessage {
  id: string
  email: string
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200)
  }, [])

  const [lingolinMessage, setLingolinMessage] =
    useState<LingolinMessage | null>(null)

  useEffect(() => {
    const getLingolinMessage = async () => {
      const { "lingolin-message": result } = await chrome.storage.sync.get(
        "lingolin-message"
      )
      if (result.trim() !== "") {
        const parsedResult = JSON.parse(result)
        console.log("🍎 ->->->-> Local storage received!!!", parsedResult)
        if (parsedResult) {
          setLingolinMessage(parsedResult)
        }
      }
    }
    getLingolinMessage()
  }, [])

  return (
    <div className="w-[500px] h-[500px] bg-purple-300 hello black mx-auto border-2 border-black p-4">
      {/* <UserDebugger /> */}
      <div className="flex flex-col gap-4 p-4 bg-yellow-300 border-4 border-blue-800">
        {lingolinMessage && (
          <div>
            <div className="text-3xl">{lingolinMessage.id}</div>
            <div className="text-3xl">{lingolinMessage.email}</div>
          </div>
        )}
      </div>

      {isLoading && <div>Loading...</div>}
      <div>YOOOOO!!</div>
    </div>
  )
}

export default App
