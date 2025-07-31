import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface ErrorContext {
  component?: string;
  function?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  toastDescription?: string;
  logLevel?: 'warn' | 'error' | 'fatal';
  silent?: boolean;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: Error | unknown,
    context: ErrorContext = {},
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastTitle = 'Sacred Shift Encountered',
      toastDescription,
      logLevel = 'error',
      silent = false
    } = options;

    // Normalize error
    const normalizedError = error instanceof Error 
      ? error 
      : new Error(typeof error === 'string' ? error : 'Unknown error occurred');

    // Log the error
    const logContext = {
      ...context,
      errorCode: 'HANDLED_ERROR',
      metadata: {
        ...context.metadata,
        originalError: error,
        errorType: error?.constructor?.name || 'Unknown'
      }
    };

    switch (logLevel) {
      case 'warn':
        logger.warn(normalizedError.message, logContext, normalizedError);
        break;
      case 'fatal':
        logger.fatal(normalizedError.message, logContext, normalizedError);
        break;
      default:
        logger.error(normalizedError.message, logContext, normalizedError);
    }

    // Show user-friendly toast
    if (showToast && !silent) {
      const description = toastDescription || 
        getErrorDescription(normalizedError) || 
        'The cosmic energies shifted unexpectedly. Please try again.';

      toast({
        title: toastTitle,
        description,
        variant: 'destructive',
      });
    }

    return normalizedError;
  }, [toast]);

  // Specific error handlers for common scenarios
  const handleAPIError = useCallback((
    error: unknown,
    endpoint: string,
    context: ErrorContext = {}
  ) => {
    return handleError(error, {
      ...context,
      function: 'apiCall',
      metadata: { ...context.metadata, endpoint }
    }, {
      toastTitle: 'Connection Issue',
      toastDescription: 'Unable to connect to Sacred Shifter services. Please check your connection.'
    });
  }, [handleError]);

  const handleValidationError = useCallback((
    error: unknown,
    field: string,
    context: ErrorContext = {}
  ) => {
    return handleError(error, {
      ...context,
      function: 'validation',
      metadata: { ...context.metadata, field }
    }, {
      logLevel: 'warn',
      toastTitle: 'Sacred Input Required',
      toastDescription: `Please check the ${field} field and try again.`
    });
  }, [handleError]);

  const handleAuthError = useCallback((
    error: unknown,
    context: ErrorContext = {}
  ) => {
    return handleError(error, {
      ...context,
      function: 'authentication'
    }, {
      toastTitle: 'Sacred Authentication',
      toastDescription: 'Please sign in to continue your spiritual journey.'
    });
  }, [handleError]);

  const handleMediaError = useCallback((
    error: unknown,
    mediaType: 'audio' | 'video' | 'image',
    context: ErrorContext = {}
  ) => {
    return handleError(error, {
      ...context,
      function: 'mediaHandler',
      metadata: { ...context.metadata, mediaType }
    }, {
      toastTitle: 'Sacred Media Unavailable',
      toastDescription: `Unable to load ${mediaType}. Please try again later.`
    });
  }, [handleError]);

  return {
    handleError,
    handleAPIError,
    handleValidationError,
    handleAuthError,
    handleMediaError
  };
};

// Helper function to get user-friendly error descriptions
function getErrorDescription(error: Error): string | null {
  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'Sacred connection interrupted. Please check your internet connection.';
  }
  
  if (message.includes('unauthorized') || message.includes('403')) {
    return 'Sacred access not permitted. Please sign in again.';
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return 'Sacred content not found in the cosmic library.';
  }
  
  if (message.includes('validation') || message.includes('invalid')) {
    return 'Sacred input needs alignment. Please check your information.';
  }
  
  if (message.includes('timeout')) {
    return 'Sacred connection taking longer than expected. Please try again.';
  }
  
  return null;
}