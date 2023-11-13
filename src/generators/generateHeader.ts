import { getContentType } from '#/convertors/getContentType';
import type { ICurlizeOptions } from '#/interfaces/ICurlizeOptions';
import { defaultHeaderFilterItems } from '#/tools/defaultHeaderFilterItems';
import { getIndent } from '#/tools/getIndent';
import type { AxiosRequestConfig } from 'axios';

export function generateHeader<T = unknown>(
  httpHeaders: AxiosRequestConfig['headers'],
  options: ICurlizeOptions<T>,
): string[] | undefined {
  const replacer = (
    headers: AxiosRequestConfig['headers'],
  ): NonNullable<AxiosRequestConfig['headers']> => {
    const processDefaultHeader = (): NonNullable<AxiosRequestConfig['headers']> => {
      if (headers == null) {
        return {};
      }

      const replaced = Object.entries(headers)
        .map(([key, value]): { key: string; value: unknown } => ({ key, value: value as unknown }))
        .filter(
          (entry) =>
            !(defaultHeaderFilterItems as readonly string[]).includes(
              entry.key.trim().toLowerCase(),
            ),
        )
        .reduce<NonNullable<AxiosRequestConfig['headers']>>((agg, entry) => {
          return { ...agg, [entry.key]: entry.value } as NonNullable<AxiosRequestConfig['headers']>;
        }, {});

      return replaced;
    };

    if (options.replacer?.header != null) {
      try {
        return options.replacer.header(headers) ?? {};
      } catch {
        return processDefaultHeader();
      }
    }

    const replaced = processDefaultHeader();
    return replaced;
  };

  const replaced = replacer(httpHeaders);

  // TODO: single space processing
  const headers = Object.entries(replaced).map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${getIndent(options)}--header '${key}: ${value.join(',')}'`;
    }

    if (key.toLocaleLowerCase() === 'content-type') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const refinedContentType = getContentType({ 'content-type': value });
      return `${getIndent(options)}--header '${key}: ${refinedContentType}'`;
    }

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${getIndent(options)}--header '${key}: ${value ?? ' '}'`;
  });

  return headers;
}
