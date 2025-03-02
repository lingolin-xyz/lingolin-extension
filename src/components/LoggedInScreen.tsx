import { UserSession } from "@/lib/types"
import Title from "./Title"

const LoggedInScreen = ({ userSession }: { userSession: UserSession }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-4">
      <Title>Hello, {userSession.email.split("@")[0]}!</Title>
      <div className="flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center justify-center pb-1.5">
          <div className="text-5xl font-bold text-shadow-like-border2 text-yellow-300">
            {userSession.credit_balance}
          </div>
          <div className="text-sm font-bold absolute bottom-0">Credits</div>
        </div>
      </div>
    </div>
  )
}

export default LoggedInScreen
