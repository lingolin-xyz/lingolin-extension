import BlurryEntranceFaster from "./BlurryEntranceFaster"
import Title from "./Title"
import { Button } from "./ui/button"

const NeedToSignIn = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-center py-20 gap-6">
      <BlurryEntranceFaster>
        <Title>No user session found</Title>
      </BlurryEntranceFaster>
      <BlurryEntranceFaster>
        <Button
          onClick={() => {
            chrome.tabs.create({
              url: "https://app.lingolin.xyz",
            })
          }}
        >
          Start Session
        </Button>
      </BlurryEntranceFaster>
    </div>
  )
}

export default NeedToSignIn
