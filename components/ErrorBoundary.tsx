
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true, error: _ };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-10 font-mono">
                    <h1 className="text-4xl font-bold text-orange-500 mb-4">Bir Hata Oluştu</h1>
                    <p className="text-slate-400 mb-8">Maalesef bir şeyler ters gitti.</p>
                    <div className="bg-black/40 p-6 rounded-xl border border-rose-500/20 max-w-2xl w-full overflow-auto">
                        <p className="text-rose-500 font-bold mb-2">Hata Detayı:</p>
                        <pre className="text-xs text-rose-300 whitespace-pre-wrap">
                            {this.state.error?.toString()}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-orange-600 rounded-xl font-bold hover:bg-orange-500 transition-colors"
                    >
                        Sayfayı Yenile
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
