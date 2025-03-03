import BlurryEntrance from "./BlurryEntrance"
import Title from "./Title"

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <BlurryEntrance delay={0.11}>
        <Title>Loading...</Title>
      </BlurryEntrance>
      <BlurryEntrance delay={0.33}>
        <div className="animate-spin">
          <img
            src="https://www.lingolin.xyz/images/lin-loading.png"
            alt="Lingolin Logo"
            className="w-10 h-10"
          />
        </div>
      </BlurryEntrance>
    </div>
  )
}

export default LoadingScreen
