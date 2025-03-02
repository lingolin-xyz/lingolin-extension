import { UserSession } from "@/lib/types"
import Title from "./Title"
import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import BlurryEntranceSuperFast from "./BlurryEntranceSuperFast"
// import { Button } from "./ui/button"

const LoggedInScreen = ({ userSession }: { userSession: UserSession }) => {
  const [targetLanguage, setTargetLanguage] = useState("English")

  useEffect(() => {
    if (chrome.storage) {
      // Load saved language from chrome.storage.sync
      chrome.storage.sync.get(["targetLanguage"], (result) => {
        if (result.targetLanguage) {
          setTargetLanguage(result.targetLanguage)
        }
      })
    }
  }, [])

  const handleLanguageChange = (value: string) => {
    setTargetLanguage(value)
    // Save to chrome.storage.sync
    if (chrome.storage) {
      chrome.storage.sync.set({ targetLanguage: value })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
      <BlurryEntranceSuperFast>
        <Title>Hi, {userSession.email.split("@")[0]}!</Title>
      </BlurryEntranceSuperFast>
      <BlurryEntranceSuperFast delay={0.1}>
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center justify-center pb-1.5">
            <div className="text-5xl font-bold text-shadow-like-border2 text-yellow-300">
              {userSession.credit_balance}
            </div>
            <div className="text-sm font-bold absolute bottom-0">Credits</div>
          </div>
        </div>
      </BlurryEntranceSuperFast>
      <BlurryEntranceSuperFast delay={0.2}>
        <div className="flex w-full justify-center gap-4 bg-zinc-100 p-3 rounded-xl">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-bold">From:</div>
            <Select
              value={targetLanguage}
              defaultValue="English"
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="!bg-white">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Indonesian">Indonesian</SelectItem>
                <SelectItem value="Hebrew">Hebrew</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-sm font-bold">To:</div>
            <Select
              value={targetLanguage}
              defaultValue="English"
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="!bg-white">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Indonesian">Indonesian</SelectItem>
                <SelectItem value="Hebrew">Hebrew</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </BlurryEntranceSuperFast>
    </div>
  )
}

export default LoggedInScreen
