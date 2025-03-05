import { useEffect, useState } from "react"
import axios from "axios"
import NeedToSignIn from "./components/NeedToSignIn"
import LoadingScreen from "./components/LoadingScreen"
import LoggedInScreen from "./components/LoggedInScreen"
import { UserSession } from "./lib/types"
import { USE_PROD } from "./lib/constants"

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
      if (!result) {
        setIsLoading(false)
        return
      }
      if (result.trim() !== "") {
        const parsedResult = JSON.parse(result)
        if (parsedResult && parsedResult.id) {
          // now ideally we should get: credit_balance and game_tier ... let's do that from the backend!!

          const res = await axios.post(
            USE_PROD
              ? "https://www.lingolin.xyz/api/v1/get-session"
              : "http://localhost:3000/api/v1/get-session",
            {
              userId: parsedResult.id,
            }
          )

          console.log("Came from get-session....")
          console.log(res.data)

          setUserSession({
            ...parsedResult,
            credit_balance: res.data.credits,
          })
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    getLingolinSession()
  }, [])

  return (
    <div className="w-[360px] h-[440px] mx-auto p-2 font-grandstander bg-white overflow-y-auto">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="flex flex-col gap-4">
          {userSession ? (
            <LoggedInScreen userSession={userSession} />
          ) : (
            <NeedToSignIn />
          )}
        </div>
      )}
    </div>
  )
}

export default App
