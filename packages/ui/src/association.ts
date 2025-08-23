export function wordAssociations(text: string): string[] {
  const tokens = Array.from(new Set(text.toLowerCase().match(/[a-zA-Z']+/g) ?? []));
  // Simple heuristic: surface uncommon tokens over length 4
  return tokens.filter(t => t.length > 4).slice(0, 12);
}
