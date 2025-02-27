import { usePrivy } from "@privy-io/react-auth";
import { Button } from "./ui/button";

const PrivyLogin = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  if (authenticated) {
    return (
      <div className="space-y-2 bg-yellow-200 p-4 w-full flex flex-col items-center justify-center hello">
        <Button onClick={logout}>Log out (shadcn button)</Button>
        <div className="text-2xl font-bold">You're in! LFG</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 bg-yellow-200 p-4 w-full flex flex-col items-center justify-center hello">
      <Button disabled={disableLogin} onClick={login}>
        Log in
      </Button>
    </div>
  );
};

export default PrivyLogin;
