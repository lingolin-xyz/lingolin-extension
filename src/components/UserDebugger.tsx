import { usePrivy } from "@privy-io/react-auth";

const UserDebugger = () => {
  const { user } = usePrivy();

  return (
    <div className="absolute bottom-0 left-0 w-full bg-white h-80 overflow-y-auto">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};

export default UserDebugger;
