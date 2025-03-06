import { UserSession } from "@/lib/types"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"

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
      title: "Fly To Save The Pepes",
      image: "https://lingolin-web-dev.vercel.app/images/game2.png",
    },
    {
      title: "LingoJump!",
      image: "https://lingolin-web-dev.vercel.app/images/game1.png",
    },
    {
      title: "LingoKart",
      image: "https://lingolin-web-dev.vercel.app/images/game3.png",
    },
  ]

  return (
    <div className="p-3 w-full">
      <Button
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-1"
        onClick={onClose}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        {games.map((game, index) => (
          <div
            key={index}
            className="overflow-hidden hover:scale-[102%] transition-all hover:shadow-lg rounded-md border border-transparent hover:border-black cursor-pointer active:opacity-50"
            style={{
              backgroundImage: `url(${game.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-12" />
            <div className="px-4 py-0.5 pb-1 bg-gradient-to-b from-transparent to-black/50">
              <div className="text-2xl text-white text-shadow-like-border2 font-bold text-balance w-full">
                {game.title}
              </div>
            </div>
          </div>
        ))}
        {/* <div>
          <pre>{JSON.stringify(userSession, null, 2)}</pre>
        </div> */}
      </div>
    </div>
  )
}

export default MiniGamesScreen
