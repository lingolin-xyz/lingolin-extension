import { UserSession } from "@/lib/types"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import PreGame from "./PreGame"
import BlurryEntranceFaster from "./BlurryEntranceFaster"

const MiniGamesScreen = ({
  onClose,
  userSession,
}: {
  onClose: () => void
  userSession: UserSession
}) => {
  console.log(userSession)

  const games = [
    {
      id: 1,
      title: "Fly To Save The Pepes",
      image: "https://lingolin-web-dev.vercel.app/images/game2.png",
    },
    {
      id: 2,
      title: "LingoJump!",
      image: "https://lingolin-web-dev.vercel.app/images/game3.png",
    },
    {
      id: 3,
      title: "LingoKart",
      image: "https://lingolin-web-dev.vercel.app/images/game4.png",
    },
  ]

  const [preGame, setPreGame] = useState<number | null>(null)

  if (preGame) {
    return <PreGame gameIndex={preGame} setGameIndex={setPreGame} />
  }

  return (
    <div className="p-2 w-full">
      <BlurryEntranceFaster>
        <Button
          variant="outline"
          size="sm"
          className="mb-6 flex items-center gap-1"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="translate-y-[1px]">Back</span>
        </Button>
      </BlurryEntranceFaster>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {games.map((game, index) => (
          <BlurryEntranceFaster key={game.id} delay={0.06 + index * 0.08}>
            <div
              onClick={() => {
                setPreGame(game.id)
              }}
              className="overflow-hidden hover:scale-[102%] transition-all hover:shadow-lg rounded-md border border-transparent hover:border-black cursor-pointer active:opacity-50"
              style={{
                backgroundImage: `url(${game.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="h-16" />
              <div className="px-4 py-0.5 pb-1 bg-gradient-to-b from-transparent to-black/50">
                <div className="text-2xl text-white text-shadow-like-border2 font-bold text-balance w-full">
                  {game.title}
                </div>
              </div>
            </div>
          </BlurryEntranceFaster>
        ))}
        {/* <div>
          <pre>{JSON.stringify(userSession, null, 2)}</pre>
        </div> */}
      </div>
    </div>
  )
}

export default MiniGamesScreen
