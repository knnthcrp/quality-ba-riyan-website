import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center h-full w-full bg-zinc-900 rounded-2xl border border-red-500/50">
          <p className="text-red-400 text-sm">Failed to load interactive scene.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
