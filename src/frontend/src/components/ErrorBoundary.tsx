import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display font-bold text-2xl text-foreground">
                  Something went wrong
                </h2>
                <p className="text-muted-foreground text-sm">
                  {this.state.error?.message ??
                    "An unexpected error occurred. Please try again."}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={this.handleReset}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button variant="outline" asChild className="border-border">
                  <Link to="/">Go Home</Link>
                </Button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
