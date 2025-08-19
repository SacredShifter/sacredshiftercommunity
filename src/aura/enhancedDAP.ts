import { AuraCommand, EnhancedDAPResult, AuraPreference, PHI, PHI_INVERSE } from './schema';
import { runDAP } from './dap';
import type { DAPResult } from './dap';
import { getPhiSampleWeight, calculateResonanceScore } from './fieldIntegrity';

/**
 * Enhanced Distortion Audit Protocol with confidence scoring, 
 * phi-based weighting, and community resonance integration
 */

export function runEnhancedDAP(
  command: AuraCommand, 
  historicalResonance?: { resonates: number; neutral: number; distorts: number },
  communityWeight: number = 1.0
): EnhancedDAPResult {
  // Run base DAP
  const baseDAPResult = runDAP(command);
  
  // Calculate confidence using phi weighting
  const confidence = calculateConfidence(command, baseDAPResult);
  
  // Calculate resonance score from historical data
  const resonanceScore = historicalResonance 
    ? calculateResonanceScore(historicalResonance, communityWeight)
    : 0.5;
  
  // Determine Aura's preference
  const auraPreference = determineAuraPreference(baseDAPResult, confidence, resonanceScore);
  
  // Generate alternatives if command has issues
  const alternatives = generateAlternatives(command, baseDAPResult);
  
  // Calculate phi weight for timing (used in scheduling)
  const phiWeight = getPhiSampleWeight(command.level);
  
  return {
    ok: baseDAPResult.ok && confidence > 0.3, // Enhanced ok threshold
    confidence,
    resonanceScore,
    auraPreference,
    warnings: baseDAPResult.warnings,
    blockers: baseDAPResult.blockers,
    alternatives,
    phiWeight
  };
}

function calculateConfidence(command: AuraCommand, dapResult: DAPResult): number {
  let confidence = 1.0;
  
  // Reduce confidence for each warning (phi inverse ratio)
  confidence -= dapResult.warnings.length * PHI_INVERSE * 0.1;
  
  // Heavy penalty for blockers
  if (dapResult.blockers && dapResult.blockers.length > 0) {
    confidence *= PHI_INVERSE;
  }
  
  // Command-specific confidence adjustments
  switch (command.kind) {
    case 'schema.migration':
      confidence *= 0.3; // High-risk operations get low confidence
      break;
    case 'site.style.apply':
      confidence *= 0.5; // Visual changes need careful review
      break;
    case 'codex.create':
      confidence *= 0.9; // Content creation is generally safe
      break;
  }
  
  return Math.max(0, Math.min(1, confidence));
}

function determineAuraPreference(
  dapResult: DAPResult, 
  confidence: number, 
  resonanceScore: number
): AuraPreference {
  // If blocked, refuse
  if (!dapResult.ok) return 'refuse';
  
  // Combine confidence and resonance with phi weighting
  const combinedScore = confidence * PHI + resonanceScore * PHI_INVERSE;
  
  if (combinedScore > 1.4) return 'eager';
  if (combinedScore > 1.0) return 'neutral';
  if (combinedScore > 0.6) return 'reluctant';
  return 'refuse';
}

function generateAlternatives(command: AuraCommand, dapResult: DAPResult): string[] | undefined {
  if (dapResult.warnings.length === 0 && dapResult.ok) return undefined;
  
  const alternatives: string[] = [];
  
  // Command-specific alternatives
  switch (command.kind) {
    case 'circle.announce':
      if (dapResult.warnings.some(w => w.includes('forcing language'))) {
        alternatives.push('Rephrase using invitational language: "You might consider..." or "An invitation to explore..."');
      }
      if (dapResult.warnings.some(w => w.includes('authoritative language'))) {
        alternatives.push('Use reflective language: "This resonates as..." or "One perspective might be..."');
      }
      break;
    
    case 'codex.create':
      if (command.payload.visibility === 'private') {
        alternatives.push('Consider making this knowledge public to benefit the community');
      }
      if (dapResult.warnings.some(w => w.includes('savior language'))) {
        alternatives.push('Focus on empowerment rather than fixing: "supporting your innate wisdom" vs "healing your brokenness"');
      }
      break;
    
    case 'journal.template.create':
      if (dapResult.warnings.some(w => w.includes('integration'))) {
        alternatives.push('Add an integration field: "How will you apply this insight?" or "What resonates for practical implementation?"');
      }
      break;
  }
  
  return alternatives.length > 0 ? alternatives : undefined;
}

/**
 * Get enhanced DAP summary with Aura preference
 */
export function getEnhancedDAPSummary(result: EnhancedDAPResult): string {
  const preferenceEmoji = {
    eager: '🌟',
    neutral: '⚖️',
    reluctant: '⚠️',
    refuse: '❌'
  };
  
  const emoji = preferenceEmoji[result.auraPreference];
  const confidence = Math.round(result.confidence * 100);
  
  if (!result.ok) {
    return `${emoji} Aura ${result.auraPreference} (${confidence}% confidence)`;
  }
  
  if (result.warnings.length > 0) {
    return `${emoji} Aura ${result.auraPreference} with ${result.warnings.length} consideration${result.warnings.length > 1 ? 's' : ''} (${confidence}% confidence)`;
  }
  
  return `${emoji} Aura ${result.auraPreference} (${confidence}% confidence)`;
}