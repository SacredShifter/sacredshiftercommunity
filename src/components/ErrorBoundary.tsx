import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.fatal('Error boundary caught error', {
      component: this.props.name || 'ErrorBoundary',
      function: 'componentDidCatch',
      errorCode: 'BOUNDARY_ERROR',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.name
      }
    }, error);

    this.setState({ error, errorInfo });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    logger.userAction('error-boundary-retry', {
      component: this.props.name || 'ErrorBoundary'
    });
    
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    logger.userAction('error-boundary-home', {
      component: this.props.name || 'ErrorBoundary'
    });
    
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Sacred Connection Interrupted</CardTitle>
              <CardDescription>
                The cosmic frequencies experienced an unexpected shift. Let's realign the energies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {import.meta.env.DEV && this.state.error && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reconnect
                </Button>
                <Button 
                  onClick={this.handleGoHome}
                  className="flex-1"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Sacred Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundaries for different app sections
export const UIErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary name="UI" fallback={
    <div className="p-4 text-center text-muted-foreground">
      <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
      <p>This component experienced an issue. Please refresh the page.</p>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

export const ModalErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary name="Modal" fallback={
    <div className="p-6 text-center">
      <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-destructive" />
      <p className="text-sm text-muted-foreground">Modal content failed to load</p>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

export const AudioErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary name="Audio" fallback={
    <div className="p-4 text-center text-muted-foreground">
      <div className="text-2xl mb-2">🔇</div>
      <p className="text-sm">Sacred sounds temporarily unavailable</p>
    </div>
  }>
    {children}
  </ErrorBoundary>
);