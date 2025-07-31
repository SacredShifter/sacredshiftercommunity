import { useCallback, useRef } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { logger } from '@/lib/logger';

interface AsyncOperationOptions {
  component?: string;
  function?: string;
  showLoadingToast?: boolean;
  successMessage?: string;
  retries?: number;
  retryDelay?: number;
}

/**
 * Hook for handling async operations with proper error handling,
 * loading states, and retries
 */
export const useAsyncError = () => {
  const { handleError } = useErrorHandler();
  const abortControllerRef = useRef<AbortController | null>(null);

  const executeAsync = useCallback(async <T,>(
    operation: (signal: AbortSignal) => Promise<T>,
    options: AsyncOperationOptions = {}
  ): Promise<T | null> => {
    const {
      component,
      function: functionName,
      retries = 0,
      retryDelay = 1000
    } = options;

    // Cancel any previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        logger.debug(`Executing async operation (attempt ${attempt + 1}/${retries + 1})`, {
          component,
          function: functionName,
          metadata: { attempt: attempt + 1, totalRetries: retries + 1 }
        });

        const result = await operation(signal);
        
        if (signal.aborted) {
          logger.debug('Async operation aborted', { component, function: functionName });
          return null;
        }

        logger.debug('Async operation completed successfully', { 
          component, 
          function: functionName,
          metadata: { attempt: attempt + 1 }
        });

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (signal.aborted) {
          logger.debug('Async operation aborted during error', { component, function: functionName });
          return null;
        }

        // Don't retry on certain errors
        if (isNonRetryableError(lastError)) {
          break;
        }

        // If we have more retries, wait before trying again
        if (attempt < retries) {
          logger.warn(`Async operation failed, retrying in ${retryDelay}ms`, {
            component,
            function: functionName,
            metadata: { 
              attempt: attempt + 1, 
              remainingRetries: retries - attempt,
              error: lastError.message 
            }
          });

          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
      }
    }

    // All retries exhausted, handle the error
    if (lastError) {
      handleError(lastError, {
        component,
        function: functionName,
        metadata: { totalAttempts: retries + 1 }
      });
    }

    return null;
  }, [handleError]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    executeAsync,
    cancel
  };
};

/**
 * Determines if an error should not be retried
 */
function isNonRetryableError(error: Error): boolean {
  const message = error.message.toLowerCase();
  
  // Don't retry authentication errors
  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return true;
  }
  
  // Don't retry validation errors
  if (message.includes('validation') || message.includes('invalid')) {
    return true;
  }
  
  // Don't retry not found errors
  if (message.includes('not found')) {
    return true;
  }
  
  // Don't retry abort errors
  if (message.includes('abort')) {
    return true;
  }
  
  return false;
}