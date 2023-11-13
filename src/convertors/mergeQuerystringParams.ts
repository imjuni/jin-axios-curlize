import type { AxiosRequestConfig } from 'axios';

export function mergeQuerytstringParams(url: URL, params: AxiosRequestConfig['params']) {
  if (params instanceof URLSearchParams) {
    const nextSp = new URLSearchParams([...params.entries(), ...url.searchParams.entries()]);

    const next = new URL(url);
    next.search = nextSp.toString();

    return next;
  }

  if (typeof params === 'object' && params != null && !Array.isArray(params)) {
    const tempSp = new URLSearchParams();

    Object.entries(params as object).forEach(([key, value]) => {
      if (!url.searchParams.has(key) && typeof value === 'string') {
        tempSp.set(key, value);
      }

      if (
        !url.searchParams.has(key) &&
        Array.isArray(value) &&
        value.every((item) => typeof item === 'string')
      ) {
        value.forEach((item) => tempSp.append(key, item as string));
      }
    });

    const nextSp = new URLSearchParams([...tempSp.entries(), ...url.searchParams.entries()]);
    const next = new URL(url);
    next.search = nextSp.toString();

    return next;
  }

  return url;
}
