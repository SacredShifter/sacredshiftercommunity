import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useErrorHandler } from '@/hooks/useErrorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

interface ProductionErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{error: Error, retry: () => void}>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
}

export class ProductionReadyErrorBoundary extends Component<
  ProductionErrorBoundaryProps, 
  ErrorBoundaryState
> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: ProductionErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ProductionErrorBoundary caught error:', error, errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  retry = () => {
    const maxRetries = this.props.maxRetries || 3;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  autoRetry = () => {
    this.retryTimeoutId = setTimeout(() => {
      this.retry();
    }, 2000);
  };

  render() {
    if (this.state.hasError) {
      const { fallback: CustomFallback } = this.props;
      const { error, retryCount } = this.state;
      const maxRetries = this.props.maxRetries || 3;

      if (CustomFallback && error) {
        return <CustomFallback error={error} retry={this.retry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Sacred Shift Interrupted</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                The cosmic energies encountered an unexpected shift. 
                This sacred moment can be restored.
              </p>
              
              {process.env.NODE_ENV === 'development' && error && (
                <details className="text-xs bg-muted p-2 rounded">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words">
                    {error.toString()}
                  </pre>
                </details>
              )}

              <div className="flex flex-col gap-2">
                {retryCount < maxRetries ? (
                  <Button onClick={this.retry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restore Sacred Flow ({maxRetries - retryCount} attempts left)
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Complete Reset
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'} 
                  className="w-full"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Sacred Grove
                </Button>
              </div>

              {retryCount > 0 && (
                <p className="text-xs text-center text-muted-foreground">
                  Attempts made: {retryCount}/{maxRetries}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export const useProductionErrorHandler = () => {
  const { handleError, handleAPIError, handleValidationError } = useErrorHandler();

  const wrapAsync = (asyncFn: () => Promise<any>) => {
    return async () => {
      try {
        return await asyncFn();
      } catch (error) {
        handleError(error, {
          component: 'ProductionErrorHandler',
          function: 'wrapAsync'
        });
        throw error;
      }
    };
  };

  return {
    handleError,
    handleAPIError,
    handleValidationError,
    wrapAsync
  };
};