import { FieldIntegrityLevel, FieldIntegrityMetrics, PHI } from './schema';

/**
 * Field Integrity Level (FIL) calculation using phi-based mathematics
 * Monitors community field distortion and triggers appropriate responses
 */

export interface FieldMetrics {
  dapBlockRate: number;
  resonanceVariance: number;
  anomalySignals: number;
  coordinatedActivity: number;
}

export function calculateFIL(metrics: FieldMetrics): FieldIntegrityLevel {
  // Weighted combination with phi-based thresholds
  const score = PHI * metrics.dapBlockRate + 
               (1/PHI) * metrics.resonanceVariance + 
               metrics.anomalySignals + 
               metrics.coordinatedActivity;
  
  if (score > Math.pow(PHI, 3)) return 4; // Circuit breaker
  if (score > Math.pow(PHI, 2)) return 3; // Quarantine  
  if (score > PHI) return 2; // Degrade
  if (score > 1) return 1; // Advisory
  return 0; // Normal
}

export function getFILDescription(level: FieldIntegrityLevel): string {
  switch (level) {
    case 0: return 'Normal - Field coherent';
    case 1: return 'Advisory - Minor disturbances detected';
    case 2: return 'Degrade - Field quality reduced, slow-mode activated';
    case 3: return 'Quarantine - Critical disturbance, limited functionality';
    case 4: return 'Circuit Breaker - Field collapse protection, read-only mode';
    default: return 'Unknown field state';
  }
}

export function getFILColor(level: FieldIntegrityLevel): string {
  switch (level) {
    case 0: return 'hsl(var(--success))';
    case 1: return 'hsl(var(--warning))';
    case 2: return 'hsl(var(--warning))';
    case 3: return 'hsl(var(--destructive))';
    case 4: return 'hsl(var(--destructive))';
    default: return 'hsl(var(--muted))';
  }
}

/**
 * Golden ratio backoff for retries and nudges
 */
export function getPhiBackoffDelay(attempt: number, baseDelay: number = 1000): number {
  return baseDelay * Math.pow(PHI, attempt);
}

/**
 * Low-discrepancy sampling using golden ratio for exploration
 */
export function getPhiSampleWeight(index: number): number {
  return (index * (1/PHI)) % 1;
}

/**
 * Resonance scoring with phi weighting
 */
export function calculateResonanceScore(
  feedbackCounts: { resonates: number; neutral: number; distorts: number },
  totalWeight: number = 1
): number {
  const { resonates, neutral, distorts } = feedbackCounts;
  const total = resonates + neutral + distorts;
  
  if (total === 0) return 0.5; // Default neutral
  
  // Phi-weighted scoring: resonance gets phi weight, distortion gets 1/phi weight
  const weightedScore = (
    resonates * PHI + 
    neutral * 1.0 + 
    distorts * (1/PHI)
  ) / (total * PHI);
  
  // Normalize to 0-1 range
  return Math.max(0, Math.min(1, weightedScore));
}