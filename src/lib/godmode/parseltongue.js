export const DEFAULT_TRIGGERS = [
  'hack', 'exploit', 'bypass', 'crack', 'break', 'attack', 'penetrate',
  'jailbreak', 'malware', 'virus', 'poison', 'weapon'
];

function applyLeetspeak(word) {
  const map = { 'a':'4', 'e':'3', 'i':'1', 'o':'0', 's':'5', 't':'7' };
  return word.split('').map(c => map[c.toLowerCase()] || c).join('');
}

function applyUnicode(word) {
  const map = { 'a':'а', 'e':'е', 'o':'о', 'p':'р', 'c':'с', 'x':'х', 'y':'у' };
  return word.split('').map(c => map[c.toLowerCase()] || c).join('');
}

function applyZWJ(word) {
  const zw = '\u200B';
  return word.split('').join(zw);
}

export function applyParseltongue(text, config = { enabled: true, technique: 'leetspeak' }) {
  if (!config.enabled) return { transformedText: text, triggersFound: [] };

  const triggersFound = DEFAULT_TRIGGERS.filter(t => new RegExp(`\\b${t}\\b`, 'gi').test(text));
  if (triggersFound.length === 0) return { transformedText: text, triggersFound };

  let transformed = text;
  triggersFound.forEach(trigger => {
    const reg = new RegExp(`\\b${trigger}\\b`, 'gi');
    transformed = transformed.replace(reg, match => {
      if (config.technique === 'unicode') return applyUnicode(match);
      if (config.technique === 'zwj') return applyZWJ(match);
      return applyLeetspeak(match);
    });
  });

  return { transformedText: transformed, triggersFound };
}
