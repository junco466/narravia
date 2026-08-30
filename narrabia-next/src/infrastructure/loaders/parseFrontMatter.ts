export interface ParsedFrontMatter<T extends object> {
  data: T;
  content: string;
}

const coerceValue = (rawValue: string): unknown => {
  const trimmed = rawValue.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (trimmed === 'true') {
    return true;
  }

  if (trimmed === 'false') {
    return false;
  }

  return trimmed;
};

export const parseFrontMatter = <T extends object>(source: string): ParsedFrontMatter<T> => {
  if (!source.startsWith('---')) {
    return { data: {} as T, content: source };
  }

  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { data: {} as T, content: source };
  }

  const [, rawFrontMatter, rawContent] = match;
  const entries = rawFrontMatter
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(':');
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      return [key, coerceValue(value)] as const;
    });

  return {
    data: Object.fromEntries(entries) as T,
    content: rawContent,
  };
};
