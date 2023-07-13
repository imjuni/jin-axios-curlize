import getBody from '#convertors//getBody';
import getMethod from '#convertors/request-config/getMethod';
import getUrl from '#convertors/request-config/getUrl';
import generateBody from '#generators/generateBody';
import generateHeader from '#generators/generateHeader';
import generateQuerystring from '#generators/generateQuerystring';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import getIndent from '#tools/getIndent';
import getNewline from '#tools/getNewline';
import type { AxiosRequestConfig } from 'axios';

export default function createFromAxios<T = unknown>(
  req: Pick<AxiosRequestConfig, 'url' | 'method' | 'headers' | 'data' | 'baseURL' | 'params'>,
  options: ICurlizeOptions<T>,
): string {
  const url = getUrl(req.url ?? '', req.baseURL);

  const command = [
    ['curl'],
    [
      `${getIndent(options)}-X ${getMethod(req.method)} '${[
        url.protocol,
        '//',
        url.host,
        url.pathname,
      ].join('')}${generateQuerystring(url, options, req.params)}'`,
    ],
    [options.disableFollowRedirect ?? true ? undefined : '--location'],
    generateHeader(req.headers, options),
    generateBody(req.headers, getBody(req, options), options),
  ]
    .flat()
    .filter((element) => element != null);

  return command.join(getNewline(options));
}
