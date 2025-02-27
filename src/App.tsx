import { useState } from "react";
import PrivyLogin from "./components/PrivyLogin";
import UserDebugger from "./components/UserDebugger";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import { usePrivy } from "@privy-io/react-auth";

type UserSession = {
  id: string;
  email: string;
  name: string;
  image: string;
};

function App() {
  const { user } = usePrivy();
  const [count, setCount] = useState(0);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-[500px] h-[500px] bg-purple-300 hello black mx-auto border-2 border-black p-4">
      {/* <UserDebugger /> */}

      {isLoading && <div>Loading...</div>}
      {userSession && <div>User session found</div>}
      {!userSession && <PrivyLogin />}
    </div>
  );
}

export default App;
