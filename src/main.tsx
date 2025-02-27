import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";
import { PRIVY_APP_ID } from "./lib/constants";
const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element not found");
}
const rootElement = ReactDOM.createRoot(root);

rootElement.render(
  <React.StrictMode>
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // Display email and wallet as login methods
        loginMethods: ["email", "wallet"],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://javitoshi.com/images/lingolin.png",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
