import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface MessageValidationRules {
  maxLength: number;
  minLength: number;
  allowedTypes: string[];
  rateLimit: {
    maxMessages: number;
    timeWindowMs: number;
  };
}

const DEFAULT_RULES: MessageValidationRules = {
  maxLength: 1000,
  minLength: 1,
  allowedTypes: ['text', 'image', 'audio', 'file'],
  rateLimit: {
    maxMessages: 10,
    timeWindowMs: 60000, // 1 minute
  }
};

interface MessageHistory {
  timestamp: number;
  userId: string;
}

export const useMessageValidation = (customRules?: Partial<MessageValidationRules>) => {
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);
  const rules = { ...DEFAULT_RULES, ...customRules };

  const validateContent = useCallback((content: string): { isValid: boolean; error?: string } => {
    // Check length
    if (content.length < rules.minLength) {
      return { isValid: false, error: 'Message too short' };
    }
    
    if (content.length > rules.maxLength) {
      return { isValid: false, error: `Message too long (max ${rules.maxLength} characters)` };
    }

    // Basic content filtering
    const bannedWords = ['spam', 'scam', 'viagra', 'crypto'];
    const lowerContent = content.toLowerCase();
    
    for (const word of bannedWords) {
      if (lowerContent.includes(word)) {
        return { isValid: false, error: 'Message contains inappropriate content' };
      }
    }

    // Check for excessive repetition
    const words = content.split(/\s+/);
    const uniqueWords = new Set(words);
    
    if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
      return { isValid: false, error: 'Message appears to be spam (too repetitive)' };
    }

    return { isValid: true };
  }, [rules]);

  const validateRateLimit = useCallback((userId: string): { isValid: boolean; error?: string } => {
    const now = Date.now();
    const cutoff = now - rules.rateLimit.timeWindowMs;
    
    // Clean old entries
    const recentMessages = messageHistory.filter(msg => 
      msg.timestamp > cutoff && msg.userId === userId
    );
    
    if (recentMessages.length >= rules.rateLimit.maxMessages) {
      return { 
        isValid: false, 
        error: `Rate limit exceeded. Please wait before sending more messages.` 
      };
    }

    return { isValid: true };
  }, [messageHistory, rules]);

  const validateMessageType = useCallback((messageType: string): { isValid: boolean; error?: string } => {
    if (!rules.allowedTypes.includes(messageType)) {
      return { isValid: false, error: `Message type '${messageType}' not allowed` };
    }
    
    return { isValid: true };
  }, [rules]);

  const validateMessage = useCallback((
    content: string,
    messageType: string = 'text',
    userId: string
  ): { isValid: boolean; error?: string } => {
    // Validate content
    const contentValidation = validateContent(content);
    if (!contentValidation.isValid) {
      return contentValidation;
    }

    // Validate message type
    const typeValidation = validateMessageType(messageType);
    if (!typeValidation.isValid) {
      return typeValidation;
    }

    // Validate rate limit
    const rateLimitValidation = validateRateLimit(userId);
    if (!rateLimitValidation.isValid) {
      return rateLimitValidation;
    }

    return { isValid: true };
  }, [validateContent, validateMessageType, validateRateLimit]);

  const recordMessage = useCallback((userId: string) => {
    const now = Date.now();
    setMessageHistory(prev => [
      ...prev.filter(msg => now - msg.timestamp < rules.rateLimit.timeWindowMs),
      { timestamp: now, userId }
    ]);
  }, [rules]);

  const validateAndSend = useCallback(async (
    content: string,
    messageType: string = 'text',
    userId: string,
    sendFunction: () => Promise<any>
  ) => {
    const validation = validateMessage(content, messageType, userId);
    
    if (!validation.isValid) {
      toast.error(validation.error);
      return false;
    }

    try {
      await sendFunction();
      recordMessage(userId);
      return true;
    } catch (error) {
      toast.error('Failed to send message');
      return false;
    }
  }, [validateMessage, recordMessage]);

  return {
    validateMessage,
    validateAndSend,
    rules
  };
};