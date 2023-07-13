import mergeQuerytstringParams from '#convertors/mergeQuerystringParams';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';

export default function generateQuerystring<T = unknown>(
  url: URL,
  options: ICurlizeOptions<T>,
  params?: unknown,
): string {
  const replacer = (searchParams: URLSearchParams): URLSearchParams => {
    if (options.replacer?.querystring != null) {
      try {
        return options.replacer.querystring(searchParams);
      } catch {
        return searchParams;
      }
    }

    return searchParams;
  };

  const merged = mergeQuerytstringParams(url, params);
  const replaced = replacer(merged.searchParams);

  if (Array.from(replaced.keys()).length <= 0) {
    return '';
  }

  const generated = Array.from(replaced.entries())
    .map(([key, value]) => {
      return options.replacer?.querystring != null
        ? `${key}=${value}`
        : `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return `?${generated}`;
}
