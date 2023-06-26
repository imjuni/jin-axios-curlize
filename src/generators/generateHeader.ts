import getContentType from '#convertors/getContentType';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import defaultHeaderFilterItems from '#tools/defaultHeaderFilterItems';
import getIndent from '#tools/getIndent';
import type { AxiosRequestConfig } from 'axios';

export default function generateHeader(
  httpHeaders: AxiosRequestConfig['headers'],
  options: ICurlizeOptions,
): string[] | undefined {
  const replacer = (
    headers: AxiosRequestConfig['headers'],
  ): NonNullable<AxiosRequestConfig['headers']> => {
    if (headers == null) {
      return {};
    }

    if (options.replacer?.header != null) {
      return options.replacer.header(headers) ?? {};
    }

    const replaced = Object.entries(headers)
      .map(([key, value]): { key: string; value: unknown } => ({ key, value: value as unknown }))
      .filter(
        (entry) =>
          !(defaultHeaderFilterItems as readonly string[]).includes(entry.key.trim().toLowerCase()),
      )
      .reduce<AxiosRequestConfig['headers']>((agg, entry) => {
        return { ...agg, [entry.key]: entry.value };
      }, {});

    return replaced!;
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
