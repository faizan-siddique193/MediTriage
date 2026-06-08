import { Component } from "react";
import ErrorState from "./ErrorState";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("MediTriage UI error:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 20px", maxWidth: 640, margin: "0 auto" }}>
          <ErrorState
            title="Something went wrong"
            message={
              this.state.error?.message ||
              "An unexpected error occurred. Please refresh or try again."
            }
            onRetry={this.handleReset}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
