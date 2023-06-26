import mergeQuerytstringParams from '#convertors/mergeQuerystringParams';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';

export default function generateQuerystring(
  url: URL,
  options: ICurlizeOptions,
  params?: unknown,
): string {
  const keys = Array.from(url.searchParams.keys());

  if (keys.length <= 0) {
    return '';
  }

  const replacer = (searchParams: URLSearchParams): URLSearchParams => {
    if (options.replacer?.querystring != null) {
      return options.replacer.querystring(searchParams);
    }

    return searchParams;
  };

  const merged = mergeQuerytstringParams(url, params);
  const replaced = replacer(merged.searchParams);

  const generated = Array.from(replaced.entries())
    .map(([key, value]) => {
      return options.replacer?.querystring != null
        ? `${key}=${value}`
        : `${key}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return `?${generated}`;
}
