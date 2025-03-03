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
import { AVALIABLE_LANGUANGES } from "@/lib/constants"
// import { Button } from "./ui/button"

const LoggedInScreen = ({ userSession }: { userSession: UserSession }) => {
  const [targetLanguage, setTargetLanguage] = useState("Spanish")
  const [nativeLanguage, setNativeLanguage] = useState("English")

  useEffect(() => {
    if (chrome.storage) {
      // Load saved language from chrome.storage.sync
      chrome.storage.sync.get(["targetLanguage"], (result) => {
        if (result.targetLanguage) {
          setTargetLanguage(result.targetLanguage)
        }
      })
      chrome.storage.sync.get(["nativeLanguage"], (result) => {
        if (result.nativeLanguage) {
          setNativeLanguage(result.nativeLanguage)
        }
      })
    }
  }, [])

  const handleTargetLanguageChange = (value: string) => {
    setTargetLanguage(value)
    if (chrome.storage) {
      const newStorage = { targetLanguage: value, nativeLanguage }
      chrome.storage.sync.set(newStorage)
    }
  }

  const handleNativeLanguageChange = (value: string) => {
    setNativeLanguage(value)
    if (chrome.storage) {
      const newStorage = { targetLanguage, nativeLanguage: value }
      chrome.storage.sync.set(newStorage)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
      <BlurryEntranceSuperFast>
        <Title>Hi, {userSession.email.split("@")[0]}!</Title>
      </BlurryEntranceSuperFast>

      <BlurryEntranceSuperFast delay={0.11}>
        <div className="flex w-[320px] justify-center gap-4 bg-zinc-100 p-3 rounded-xl">
          <div className="flex flex-col gap-1 flex-1">
            <div className="text-xs font-bold">Native language:</div>
            <Select
              value={nativeLanguage}
              defaultValue="English"
              onValueChange={handleNativeLanguageChange}
            >
              <SelectTrigger className="!bg-white">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="max-h-[260px] overflow-y-auto">
                {AVALIABLE_LANGUANGES.map((language) => (
                  <SelectItem
                    key={language}
                    value={language}
                    className="font-grandstander"
                  >
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <div className="text-xs font-bold">Target language:</div>
            <Select
              value={targetLanguage}
              defaultValue="English"
              onValueChange={handleTargetLanguageChange}
            >
              <SelectTrigger className="!bg-white">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent className="max-h-[260px] overflow-y-auto">
                {AVALIABLE_LANGUANGES.map((language) => (
                  <SelectItem
                    key={language}
                    value={language}
                    className="font-grandstander"
                  >
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </BlurryEntranceSuperFast>

      {/* <BlurryEntranceSuperFast delay={0.22}>
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex flex-col items-center justify-center pb-1.5">
            <div className="text-5xl font-bold text-shadow-like-border2 text-yellow-300">
              {userSession.credit_balance}
            </div>
            <div className="text-sm font-bold absolute bottom-0">Credits</div>
          </div>
        </div>
      </BlurryEntranceSuperFast> */}
    </div>
  )
}

export default LoggedInScreen
