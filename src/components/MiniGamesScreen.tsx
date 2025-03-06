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
  const games = [
    {
      title: "Vocabulary Quiz",
      image: "https://javitoshi.com/images/red-lp.png",
    },
    {
      title: "Word Matching",
      image: "/images/word-matching.jpg",
    },
    {
      title: "Sentence Builder",
      image: "/images/sentence-builder.jpg",
    },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button
        variant="outline"
        size="sm"
        className="mb-6 flex items-center gap-1"
        onClick={onClose}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div
            key={index}
            className="overflow-hidden hover:shadow-lg transition-shadow rounded-xl cursor-pointer active:opacity-50"
            style={{
              backgroundImage: `url(${game.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-8" />
            <div className="px-4 py-0.5 pb-1 bg-gradient-to-b from-transparent to-black/50">
              <div className="text-lg text-white text-shadow-like-border2 font-medium text-center w-full">
                {game.title}
              </div>
            </div>
          </div>
        ))}
        <div>
          <pre>{JSON.stringify(userSession, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default MiniGamesScreen
