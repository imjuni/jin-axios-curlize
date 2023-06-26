import type { AxiosRequestConfig } from 'axios';

export default function pickContentType(header: AxiosRequestConfig['headers']): string | undefined {
  if (header?.['Content-Type'] != null) {
    return header['Content-Type'] as string;
  }

  if (header?.['content-type'] != null) {
    return header['content-type'] as string;
  }

  if (header?.['Content-type'] != null) {
    return header['Content-type'] as string;
  }

  if (header?.['content-Type'] != null) {
    return header['content-Type'] as string;
  }

  return undefined;
}
