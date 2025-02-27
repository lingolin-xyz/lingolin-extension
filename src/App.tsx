import { useEffect, useState } from "react"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200)
  }, [])

  return (
    <div className="w-[500px] h-[500px] bg-purple-300 hello black mx-auto border-2 border-black p-4">
      {/* <UserDebugger /> */}

      {isLoading && <div>Loading...</div>}
      <div>YOOOOO!!</div>
    </div>
  )
}

export default App
