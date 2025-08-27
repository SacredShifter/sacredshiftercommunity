/**
 * Production-ready unified logging system for Sacred Shifter
 * Replaces all console.* calls with structured logging
 */
import * as Sentry from "@sentry/react";

export interface LogContext {
  component?: string;
  function?: string;
  userId?: string;
  sessionId?: string;
  postId?: string;
  errorCode?: string;
  metadata?: Record<string, any>;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context: LogContext;
  stack?: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private sessionId = this.generateSessionId();
  
  private generateSessionId(): string {
    return `ss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    context: LogContext = {},
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        sessionId: this.sessionId,
      },
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  private output(entry: LogEntry): void {
    // In development, use console with colors and grouping
    if (this.isDevelopment) {
      const color = {
        debug: '#6B7280',
        info: '#3B82F6',
        warn: '#F59E0B',
        error: '#EF4444',
        fatal: '#DC2626'
      }[entry.level];

      console.groupCollapsed(
        `%c[${entry.level.toUpperCase()}] ${entry.message}`,
        `color: ${color}; font-weight: bold;`
      );
      
      if (entry.context.component) {
        console.log('📦 Component:', entry.context.component);
      }
      if (entry.context.function) {
        console.log('⚡ Function:', entry.context.function);
      }
      if (entry.context.userId) {
        console.log('👤 User:', entry.context.userId);
      }
      if (entry.context.metadata) {
        console.log('📊 Metadata:', entry.context.metadata);
      }
      if (entry.stack) {
        console.log('📋 Stack:', entry.stack);
      }
      
      console.log('🕐 Time:', entry.timestamp);
      console.groupEnd();
    }

    // In production, send to external logging service (if configured)
    if (!this.isDevelopment) {
      this.sendToLoggingService(entry);
    }
  }

  private async sendToLoggingService(entry: LogEntry): Promise<void> {
    if (import.meta.env.VITE_SENTRY_DSN) {
      const sentryLevel = entry.level === 'debug' ? 'debug' :
                          entry.level === 'info' ? 'info' :
                          entry.level === 'warn' ? 'warning' :
                          'error';

      const error = new Error(entry.message);
      error.stack = entry.stack;

      if (entry.level === 'error' || entry.level === 'fatal') {
        Sentry.captureException(error, {
            extra: entry.context,
            level: sentryLevel,
        });
      } else {
        Sentry.captureMessage(entry.message, {
            extra: entry.context,
            level: sentryLevel,
        });
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('debug', message, context));
  }

  info(message: string, context?: LogContext): void {
    this.output(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.output(this.createLogEntry('warn', message, context, error));
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.output(this.createLogEntry('error', message, context, error));
  }

  fatal(message: string, context?: LogContext, error?: Error): void {
    this.output(this.createLogEntry('fatal', message, context, error));
  }

  // Specific logging methods for common operations
  apiCall(endpoint: string, method: string, context?: LogContext): void {
    this.debug(`API ${method} ${endpoint}`, {
      ...context,
      function: 'apiCall',
      metadata: { endpoint, method }
    });
  }

  apiError(endpoint: string, method: string, error: Error, context?: LogContext): void {
    this.error(`API ${method} ${endpoint} failed: ${error.message}`, {
      ...context,
      function: 'apiCall',
      errorCode: 'API_ERROR',
      metadata: { endpoint, method }
    }, error);
  }

  userAction(action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, {
      ...context,
      function: 'userAction',
      metadata: { action }
    });
  }

  authEvent(event: string, context?: LogContext): void {
    this.info(`Auth event: ${event}`, {
      ...context,
      function: 'authEvent',
      metadata: { event }
    });
  }

  componentMount(component: string, context?: LogContext): void {
    this.debug(`Component mounted: ${component}`, {
      ...context,
      component,
      function: 'componentMount'
    });
  }

  componentError(component: string, error: Error, context?: LogContext): void {
    this.error(`Component error in ${component}: ${error.message}`, {
      ...context,
      component,
      function: 'componentError',
      errorCode: 'COMPONENT_ERROR'
    }, error);
  }
}

export const logger = new Logger();

// Development helper to view logs
if (import.meta.env.DEV) {
  (window as any).viewLogs = () => {
    const logs = JSON.parse(localStorage.getItem('ss_logs') || '[]');
    console.table(logs);
    return logs;
  };
}
