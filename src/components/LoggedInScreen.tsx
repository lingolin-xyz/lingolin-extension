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
import { Button } from "./ui/button"
import { LayoutDashboard, FileText, Shield, MessageSquare } from "lucide-react"

const LoggedInScreen = ({ userSession }: { userSession: UserSession }) => {
  const [targetLanguage, setTargetLanguage] = useState("")
  const [nativeLanguage, setNativeLanguage] = useState("")

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
        <div className="flex items-center justify-center gap-3 h-28">
          <BlurryEntrance delay={0.18}>
            <img
              src="https://javitoshi.com/images/lingolin.png"
              alt="lingolin"
              className="w-14 h-14"
            />
          </BlurryEntrance>
          <div className="">
            <BlurryEntrance delay={0.28}>
              {userSession && userSession.email && (
                <div className="font-semibold text-xl">
                  Hi, {userSession.email.split("@")[0]}!
                </div>
              )}
            </BlurryEntrance>
          </div>
        </div>
      </BlurryEntranceSuperFast>

      <BlurryEntranceSuperFast delay={0.22}>
        <div className="flex flex-wrap gap-2.5 justify-center items-center">
          <a
            href="https://lingolin.xyz/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </a>

          <a
            href="https://x.com/hellolingolin"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline2">
              <MessageSquare className="w-4 h-4" />
              Feedback
            </Button>
          </a>

          <a
            href="https://lingolin.xyz/terms-of-use"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline2">
              <FileText className="w-4 h-4" />
              Terms of Use
            </Button>
          </a>

          <a
            href="https://lingolin.xyz/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            <Button variant="outline2">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </Button>
          </a>
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
