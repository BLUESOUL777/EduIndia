import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 text-center shadow-lg">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-destructive" size={32} />
            </div>
            
            <h1 className="text-xl font-semibold text-card-foreground mb-2">
              कुछ गलत हुआ / Something went wrong
            </h1>
            
            <p className="text-muted-foreground mb-6">
              हमें खेद है, लेकिन कुछ अप्रत्याशित हुआ। कृपया पृष्ठ को रीफ्रेश करने का प्रयास करें।
              <br />
              <span className="text-xs">We're sorry, but something unexpected happened. Please try refreshing the page.</span>
            </p>
            
            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                पृष्ठ रीफ्रेश करें / Refresh Page
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                फिर कोशिश करें / Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-muted text-muted-foreground py-3 rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center"
              >
                <Home size={16} className="mr-2" />
                होम पर जाएं / Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  त्रुटि विवरण / Error Details (Development)
                </summary>
                <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;