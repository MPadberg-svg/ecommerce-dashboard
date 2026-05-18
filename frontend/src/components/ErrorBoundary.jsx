import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In a production app, you would log this to an external service like Sentry
    console.error("ErrorBoundary caught an unhandled exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card error-fallback" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h4>Visualizer Unavailable</h4>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            An error occurred while rendering this data asset.
          </p>
          <button 
            type="button"
            className="ghost"
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}
          >
            Retry Render
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}