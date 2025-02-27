import { usePrivy } from "@privy-io/react-auth";

const PrivyLogin = () => {
  const { ready, authenticated, login, logout } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  if (authenticated) {
    return (
      <div className="space-y-2">
        <div className="text-2xl font-bold">You're in! LFG</div>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }

  return (
    <button disabled={disableLogin} onClick={login}>
      Log in
    </button>
  );
};

export default PrivyLogin;
