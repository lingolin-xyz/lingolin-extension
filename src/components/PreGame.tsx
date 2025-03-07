import FlyToSaveThePepes from "./games/FlyToSaveThePepes"

const PreGame = ({
  gameIndex,
  setGameIndex,
}: {
  gameIndex: number
  setGameIndex: (index: number) => void
}) => {
  // ! todo: get top scores on the game...
  return (
    <div className="w-full h-[calc(100vh-16px)] flex items-center justify-center">
      {gameIndex === 1 && <FlyToSaveThePepes onClose={() => setGameIndex(0)} />}
    </div>
  )
}

export default PreGame
