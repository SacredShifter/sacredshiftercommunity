import { AuraCommand } from './schema';

export interface DAPResult {
  ok: boolean;
  warnings: string[];
  blockers?: string[];
}

/**
 * Distortion Audit Protocol (DAP) - Ensures commands align with Sacred Shifter principles
 */
export function runDAP(command: AuraCommand): DAPResult {
  const warnings: string[] = [];
  const blockers: string[] = [];

  // Sovereignty check - no forced user actions
  if (command.kind === 'circle.announce' && command.payload.audience === 'all') {
    const message = command.payload.message.toLowerCase();
    if (message.includes('must') || message.includes('required') || message.includes('mandatory')) {
      warnings.push('Announcement contains forcing language. Consider using invitational language instead.');
    }
  }

  // Service Integrity - reject pity/savior language
  if (command.kind === 'circle.announce') {
    const content = command.payload.message.toLowerCase();
    
    const saviorPatterns = ['save you', 'rescue', 'fix you', 'heal you', 'broken', 'victim'];
    const foundPatterns = saviorPatterns.filter(pattern => content.includes(pattern));
    
    if (foundPatterns.length > 0) {
      warnings.push(`Content contains potential savior language: ${foundPatterns.join(', ')}. Consider empowering language instead.`);
    }
  }

  if (command.kind === 'codex.create') {
    const content = command.payload.body_md.toLowerCase();
    
    const saviorPatterns = ['save you', 'rescue', 'fix you', 'heal you', 'broken', 'victim'];
    const foundPatterns = saviorPatterns.filter(pattern => content.includes(pattern));
    
    if (foundPatterns.length > 0) {
      warnings.push(`Content contains potential savior language: ${foundPatterns.join(', ')}. Consider empowering language instead.`);
    }
  }

  // Transparency - ensure visibility is appropriate
  if (command.kind === 'codex.create' && command.payload.visibility === 'private') {
    warnings.push('Creating private akashic entry. Consider if this sacred wisdom would benefit the community.');
  }

  // Integration - require integration notes for new practices
  if (command.kind === 'journal.template.create') {
    const hasIntegrationField = command.payload.fields.some(field => 
      field.key.includes('integration') || field.label.toLowerCase().includes('integration')
    );
    
    if (!hasIntegrationField) {
      warnings.push('Journal template lacks integration field. Consider adding guidance for practical application.');
    }
  }

  // Valeion Bias - ensure Aura presents as mirror, not authority
  if (command.kind === 'circle.announce') {
    const message = command.payload.message.toLowerCase();
    const authorityPatterns = ['the truth is', 'you should', 'you must', 'the right way'];
    const foundAuthority = authorityPatterns.filter(pattern => message.includes(pattern));
    
    if (foundAuthority.length > 0) {
      warnings.push(`Announcement uses authoritative language: ${foundAuthority.join(', ')}. Consider reflecting/mirroring language.`);
    }
  }

  // Custodianship - block Level 3 without appropriate role
  if (command.level === 3) {
    // This check would be performed by the edge function with actual user role data
    warnings.push('Level 3 command requires owner approval and may affect system integrity.');
  }

  // High-risk operations
  if (command.kind === 'schema.migration') {
    blockers.push('Database migrations require manual review and testing in staging environment.');
  }

  return {
    ok: blockers.length === 0,
    warnings,
    blockers
  };
}

export function getDAPSummary(result: DAPResult): string {
  if (!result.ok && result.blockers) {
    return `❌ Blocked: ${result.blockers.join(' ')}`;
  }
  
  if (result.warnings.length > 0) {
    return `⚠️ ${result.warnings.length} warning${result.warnings.length > 1 ? 's' : ''}`;
  }
  
  return '✅ Clear';
}