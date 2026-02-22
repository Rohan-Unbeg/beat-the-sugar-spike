"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-sand flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] p-8 max-w-sm w-full text-center shadow-2xl border-2 border-bark/5">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="font-display font-black text-2xl text-bark mb-4">Oops! Something spiked.</h1>
            <p className="text-bark-light font-medium mb-8 leading-relaxed">
              We encountered an unexpected error. Don&apos;t worry, your progress is safe.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-2xl bg-bark text-white font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" /> Reload App
            </button>
            {process.env.NODE_ENV === "development" && (
                <div className="mt-8 p-4 bg-rose-50 rounded-xl text-left overflow-auto max-h-40">
                    <p className="text-[10px] font-mono text-rose-700 whitespace-pre-wrap">
                        {this.state.error?.stack}
                    </p>
                </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
