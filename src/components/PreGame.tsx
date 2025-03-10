import { Suspense } from "react"
import FlyToSaveThePepes from "./games/FlyToSaveThePepes"

const PreGame = ({
  gameIndex,
  setGameIndex,
  userId,
}: {
  gameIndex: number
  setGameIndex: (index: number) => void
  userId: string
}) => {
  // ! todo: get top scores on the game...
  return (
    <div className="w-full h-[calc(100vh-16px)] flex items-center justify-center">
      {gameIndex === 1 && (
        <Suspense fallback={<div>Loading...</div>}>
          <FlyToSaveThePepes onClose={() => setGameIndex(0)} userId={userId} />
        </Suspense>
      )}
    </div>
  )
}

export default PreGame
