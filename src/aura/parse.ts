import { AuraCommand } from './schema';

export function parseToCommand(input: string): AuraCommand | null {
  const s = input.toLowerCase().trim();
  
  // Akashic Constellation / Codex creation patterns (sacred upgrade from codex)
  if (s.startsWith('add akashic entry') || s.startsWith('create akashic entry') || 
      s.startsWith('add codex entry') || s.startsWith('create codex entry')) {
    const titleMatch = input.match(/(?:add|create) (?:akashic|codex) entry ['"]([^'"]+)['"]?/i);
    const bodyMatch = input.match(/with (?:body|content) ['"`]([^'"`]+)['"`]?/i);
    const visibilityMatch = input.match(/(?:visible|visibility)[:=]?\s*(public|private|circle)/i);
    
    if (titleMatch && bodyMatch) {
      return {
        kind: 'codex.create',
        level: 1,
        payload: {
          title: titleMatch[1],
          body_md: bodyMatch[1],
          visibility: (visibilityMatch?.[1] as any) || 'public'
        }
      };
    }
  }
  
  // Announcements
  if (s.startsWith('announce') || s.startsWith('send announcement')) {
    const audienceMatch = input.match(/(?:to|for)\s+(all|admins|members)/i);
    const messageMatch = input.match(/announce(?:ment)?:?\s*(.+)/i) || 
                        input.match(/send announcement:?\s*(.+)/i);
    
    if (messageMatch) {
      return {
        kind: 'circle.announce',
        level: 1,
        payload: {
          audience: (audienceMatch?.[1] as any) || 'all',
          message: messageMatch[1].replace(/^['"`]|['"`]$/g, '')
        }
      };
    }
  }
  
  // Journal template creation
  if (s.includes('journal template') && (s.includes('create') || s.includes('add'))) {
    const titleMatch = input.match(/(?:create|add) journal template ['"]([^'"]+)['"]?/i);
    
    if (titleMatch) {
      // Default fields for basic template
      const fields = [
        { key: 'reflection', label: 'Reflection', type: 'long' as const },
        { key: 'insights', label: 'Insights', type: 'text' as const },
        { key: 'mood', label: 'Mood', type: 'select' as const, options: ['Peaceful', 'Energized', 'Contemplative', 'Challenged'] }
      ];
      
      return {
        kind: 'journal.template.create',
        level: 1,
        payload: {
          title: titleMatch[1],
          fields
        }
      };
    }
  }
  
  // Moderation flagging
  if (s.includes('flag') && (s.includes('post') || s.includes('comment') || s.includes('user'))) {
    const resourceMatch = input.match(/flag\s+(post|comment|user)/i);
    const idMatch = input.match(/(?:id|#)\s*([a-zA-Z0-9-]+)/i);
    const reasonMatch = input.match(/(?:for|because|reason[:=]?)\s*(.+)/i);
    
    if (resourceMatch && idMatch && reasonMatch) {
      return {
        kind: 'moderation.flag',
        level: 1,
        payload: {
          resource: resourceMatch[1] as any,
          id: idMatch[1],
          reason: reasonMatch[1]
        }
      };
    }
  }
  
  // Style preview (Level 2)
  if (s.includes('preview') && (s.includes('style') || s.includes('theme') || s.includes('color'))) {
    // Parse color/style tokens from natural language
    const tokens: Record<string, string> = {};
    
    if (s.includes('dark')) tokens['--background'] = 'hsl(222.2 84% 4.9%)';
    if (s.includes('purple')) tokens['--primary'] = 'hsl(263.4 70% 50.4%)';
    if (s.includes('gold')) tokens['--accent'] = 'hsl(42.4 69% 60%)';
    
    return {
      kind: 'site.style.preview',
      level: 2,
      payload: { tokens }
    };
  }
  
  // Style application (Level 3)
  if (s.includes('apply') && (s.includes('style') || s.includes('theme'))) {
    const tokens: Record<string, string> = {};
    
    if (s.includes('dark')) tokens['--background'] = 'hsl(222.2 84% 4.9%)';
    if (s.includes('purple')) tokens['--primary'] = 'hsl(263.4 70% 50.4%)';
    
    return {
      kind: 'site.style.apply',
      level: 3,
      payload: { tokens }
    };
  }
  
  return null;
}

export function getCommandDescription(command: AuraCommand): string {
  switch (command.kind) {
    case 'codex.create':
      return `Create akashic entry "${command.payload.title}" (${command.payload.visibility})`;
    case 'codex.update':
      return `Update akashic entry ${command.payload.id}`;
    case 'circle.announce':
      return `Send announcement to ${command.payload.audience}: "${command.payload.message.substring(0, 50)}${command.payload.message.length > 50 ? '...' : ''}"`;
    case 'moderation.flag':
      return `Flag ${command.payload.resource} ${command.payload.id} for: ${command.payload.reason}`;
    case 'journal.template.create':
      return `Create journal template "${command.payload.title}" with ${command.payload.fields.length} fields`;
    case 'site.style.preview':
      return `Preview style changes: ${Object.keys(command.payload.tokens).length} tokens`;
    case 'site.style.apply':
      return `Apply style changes: ${Object.keys(command.payload.tokens).length} tokens`;
    case 'module.scaffold':
      return `Scaffold new module "${command.payload.name}"`;
    case 'schema.migration':
      return `Execute database migration`;
    default:
      return 'Unknown command';
  }
}