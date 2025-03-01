import { useEffect, useState } from "react"
import axios from "axios"
import NeedToSignIn from "./components/NeedToSignIn"
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
    <div className="w-[360px] h-[440px] mx-auto p-2 font-grandstander">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {userSession ? (
            <div>
              <div className="text-3xl">{userSession.id}</div>
              <div className="text-3xl">{userSession.email}</div>
            </div>
          ) : (
            <NeedToSignIn />
          )}
        </div>
      )}
    </div>
  )
}

export default App
