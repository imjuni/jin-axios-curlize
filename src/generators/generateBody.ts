import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import getIndent from '#tools/getIndent';
import shellescape from '#tools/shellescape';
import type { AxiosRequestConfig } from 'axios';
import fastSafeStringify from 'fast-safe-stringify';

export default function generateBody<T = unknown>(
  httpHeaders: AxiosRequestConfig['headers'],
  body: { form: boolean; data?: T },
  options: ICurlizeOptions<T>,
): string[] {
  const { data } = body;

  const replacer = (bodyData?: T) => {
    if (options.replacer?.body != null) {
      try {
        return options.replacer.body(httpHeaders, bodyData);
      } catch {
        return bodyData;
      }
    }

    return bodyData;
  };

  const replaced = replacer(data);

  if (replaced == null) {
    return [];
  }

  // application/x-www-form-urlencoded 방식인가 아닌가
  if (body.form) {
    return Object.entries(replaced)
      .map<[string, string][]>(([key, values]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Array.isArray(values) ? values.map((value) => [key, value]) : [[key, values]];
      })
      .flat()
      .map(([key, value]) => `${getIndent(options)}--data ${key}='${value}'`);
  }

  return [
    [getIndent(options), '--data', `$${shellescape([fastSafeStringify(body.data)])}`]
      .filter((item) => item !== '')
      .join(' '),
  ];
}
