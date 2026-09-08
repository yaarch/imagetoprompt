import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    const msg = error?.message || "";
    // Suppress external wallet extension errors
    if (
      msg.includes("MetaMask") ||
      msg.includes("Failed to connect to MetaMask") ||
      msg.includes("ethereum")
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const msg = error?.message || "";
    if (
      msg.includes("MetaMask") ||
      msg.includes("Failed to connect to MetaMask") ||
      msg.includes("ethereum")
    ) {
      return;
    }
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4 text-white">
          <div className="max-w-md w-full rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-center space-y-4 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Application Encountered an Issue</h2>
              <p className="mt-1 text-xs text-neutral-400">
                {this.state.error?.message || "An unexpected error occurred."}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
