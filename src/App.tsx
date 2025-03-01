import { useEffect, useState } from "react"
import axios from "axios"

interface UserSession {
  id: string
  email: string
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const [userSession, setUserSession] = useState<UserSession | null>(null)

  // useEffect(() => {
  //   setTimeout(() => {

  //   }, 200)
  // }, [])

  useEffect(() => {
    const getLingolinSession = async () => {
      const { "lingolin-message": result } = await chrome.storage.sync.get(
        "lingolin-message"
      )
      if (result.trim() !== "") {
        const parsedResult = JSON.parse(result)
        console.log("🍎 ->->->-> Local storage received!!!", parsedResult)
        if (parsedResult && parsedResult.id) {
          // now ideally we should get: credit_balance and game_tier ... let's do that from the backend!!

          const res = await axios.post(
            "http://localhost:3000/api/v1/get-session",
            {
              userId: parsedResult.id,
            }
          )
          console.log("🍎 ->->->-> Local storage received!!!", res.data)

          setUserSession(parsedResult)
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    }
    getLingolinSession()
  }, [])

  return (
    <div className="w-[500px] h-[500px] bg-purple-300 hello black mx-auto border-2 border-black p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4 p-4 bg-yellow-300 border-4 border-blue-800">
          {userSession ? (
            <div>
              <div className="text-3xl">{userSession.id}</div>
              <div className="text-3xl">{userSession.email}</div>
            </div>
          ) : (
            <div>
              <div className="text-3xl">No user session found</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
