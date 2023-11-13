function removeStartSlash(input: string): string {
  if (input.startsWith('/')) {
    return input;
  }

  return `/${input}`;
}

export function getUrl(input: string, base?: string): URL {
  if (input === '' && base == null) {
    throw new Error('invalid url');
  }

  if (base != null) {
    return new URL(input, base);
  }

  if (input.startsWith('http')) {
    return new URL(input);
  }

  return new URL(removeStartSlash(input), 'http://localhost');
}
