import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";
import "./index.css";

// Intercept third-party browser extension errors (e.g. MetaMask, Phantom, web3 wallets)
// These extensions inject content scripts into every page/iframe and fail when sandboxed.
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason?.message || String(event.reason || "");
    const stack = event.reason?.stack || "";
    if (
      reason.includes("MetaMask") ||
      reason.includes("Failed to connect to MetaMask") ||
      reason.includes("ethereum") ||
      reason.includes("solana") ||
      stack.includes("chrome-extension://") ||
      stack.includes("moz-extension://")
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn("Suppressed external wallet extension error:", reason);
    }
  });

  window.addEventListener("error", (event) => {
    const message = event.message || "";
    const filename = event.filename || "";
    if (
      message.includes("MetaMask") ||
      message.includes("Failed to connect to MetaMask") ||
      message.includes("ethereum") ||
      filename.includes("chrome-extension://") ||
      filename.includes("moz-extension://")
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      console.warn("Suppressed external wallet script error:", message);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
