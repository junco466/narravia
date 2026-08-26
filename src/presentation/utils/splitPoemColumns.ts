export const splitPoemColumns = (content: string): [string, string] | null => {
  const stanzas = content
    .split(/\n{2,}/)
    .map((stanza) => stanza.trim())
    .filter(Boolean);

  if (stanzas.length < 4) {
    return null;
  }

  const weightOf = (stanza: string) => stanza.split('\n').length + 1;
  const totalWeight = stanzas.reduce((sum, stanza) => sum + weightOf(stanza), 0);
  const target = totalWeight / 2;

  let runningWeight = 0;
  let splitIndex = stanzas.length;

  for (let i = 0; i < stanzas.length; i += 1) {
    const weightIncludingStanza = runningWeight + weightOf(stanzas[i]);

    if (weightIncludingStanza >= target) {
      const diffIncluding = Math.abs(weightIncludingStanza - target);
      const diffExcluding = Math.abs(runningWeight - target);
      splitIndex = diffIncluding <= diffExcluding ? i + 1 : i;
      break;
    }

    runningWeight = weightIncludingStanza;
  }

  splitIndex = Math.min(Math.max(splitIndex, 1), stanzas.length - 1);

  const left = stanzas.slice(0, splitIndex).join('\n\n');
  const right = stanzas.slice(splitIndex).join('\n\n');

  return right ? [left, right] : null;
};
