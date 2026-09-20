import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Application Error Caught by Boundary]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-elevated border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              An unexpected error occurred in this view. Our team has been notified.
            </p>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="p-3 bg-slate-100 rounded-lg text-left text-xs font-mono text-rose-700 overflow-x-auto mb-6 max-h-32">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-xl hover:bg-brand-700 transition"
              >
                <RefreshCw className="w-4 h-4" /> Reload
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                <Home className="w-4 h-4" /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
