import FlyToSaveThePepes from "./games/FlyToSaveThePepes"

const PreGame = ({ gameIndex }: { gameIndex: number }) => {
  // ! todo: get top scores on the game...
  return (
    <div className="hello w-full h-[calc(100vh-16px)] flex items-center justify-center">
      {gameIndex === 1 && <FlyToSaveThePepes />}
    </div>
  )
}

export default PreGame
