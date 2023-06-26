import type { AxiosRequestConfig } from 'axios';

/**
 * Generate Option
 */
export default interface ICurlizeOptions {
  /**
   * prettify command. use newline charactor
   * */
  prettify: boolean;

  /**
   * indent size, it pass to stringify
   *
   * @default 2
   * */
  indent?: number;

  /**
   * Disable redirection follow option. this option not setted or false, add --location option.
   */
  disableFollowRedirect?: boolean;

  /** replace input data for curl command building */
  replacer?: {
    querystring?: (qs: URLSearchParams) => URLSearchParams;
    header?: (arc: AxiosRequestConfig['headers']) => AxiosRequestConfig['headers'];
    body?: <T = unknown>(header: AxiosRequestConfig['headers'], data: T) => T;
  };
}
