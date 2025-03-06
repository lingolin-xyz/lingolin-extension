import { UserSession } from "@/lib/types"
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
import BlurryEntrance from "./BlurryEntrance"
import { LayoutDashboard, Shield, MessageSquare } from "lucide-react"
import { Button } from "./ui/button"
import MiniGamesScreen from "./MiniGamesScreen"

const LoggedInScreen = ({ userSession }: { userSession: UserSession }) => {
  const [targetLanguage, setTargetLanguage] = useState("")
  const [nativeLanguage, setNativeLanguage] = useState("")
  const [showMiniGamesScreen, setShowMiniGamesScreen] = useState(true)

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

  if (showMiniGamesScreen)
    return (
      <div>
        <MiniGamesScreen
          onClose={() => setShowMiniGamesScreen(false)}
          userSession={userSession}
        />
      </div>
    )

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
      <BlurryEntranceSuperFast delay={0.03}>
        <div className="flex flex-col w-[320px] justify-center gap-4 bg-zinc-100 p-3 rounded-xl">
          <div className="flex flex-col gap-1 flex-1">
            <div className="text-base font-bold">
              Your main/native language:
            </div>
            <Select
              value={nativeLanguage}
              onValueChange={handleNativeLanguageChange}
            >
              <SelectTrigger className="!bg-white !text-base !font-semibold !p-0 !px-3">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent className="max-h-[240px] overflow-y-auto">
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
            <div className="text-base font-bold">
              The language you want to learn:
            </div>
            <Select
              value={targetLanguage}
              onValueChange={handleTargetLanguageChange}
            >
              <SelectTrigger className="!bg-white !text-base !font-semibold !p-0 !px-3">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent className="max-h-[240px] overflow-y-auto">
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

      <BlurryEntranceSuperFast delay={0.15}>
        <div className="flex items-center justify-center gap-8 h-24">
          <div className="translate-y-1">
            <div className="flex flex-col items-center justify-center">
              <div className="relative flex flex-col items-center justify-center pb-1.5">
                <div className="text-5xl font-bold text-shadow-like-border2 text-yellow-300">
                  {userSession.credit_balance}
                </div>
                <div className="text-sm font-bold absolute bottom-0">
                  Credits
                </div>
              </div>
            </div>
            {/* <BlurryEntrance delay={0.28}>
              {userSession && userSession.email && (
                <div className="font-semibold text-xl">
                  Hi, {userSession.email.split("@")[0]}!
                </div>
              )}
            </BlurryEntrance> */}
          </div>
          <BlurryEntrance delay={0.18}>
            <img
              src="https://javitoshi.com/images/lingolin.png"
              alt="lingolin"
              className="w-14 h-14"
            />
          </BlurryEntrance>
        </div>
      </BlurryEntranceSuperFast>

      <div className="w-full pb-6">
        <BlurryEntrance delay={0.22}>
          <div className="flex flex-col gap-2 w-full">
            <Button onClick={() => setShowMiniGamesScreen(true)}>
              Play Mini Games
            </Button>
          </div>
        </BlurryEntrance>
      </div>

      <BlurryEntranceSuperFast delay={0.22}>
        <div className="flex flex-wrap gap-6 justify-center items-center">
          <a
            href="https://www.lingolin.xyz/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" />
            <div className="translate-y-[1px]">Dashboard</div>
          </a>

          <a
            href="https://x.com/hellolingolin"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            <MessageSquare className="w-4 h-4" />
            <div className="translate-y-[1px]">Contact Us</div>
          </a>

          <a
            href="https://www.lingolin.xyz/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1"
          >
            <Shield className="w-4 h-4" />
            <div className="translate-y-[1px]">Privacy Policy</div>
          </a>
        </div>
      </BlurryEntranceSuperFast>
    </div>
  )
}

export default LoggedInScreen
