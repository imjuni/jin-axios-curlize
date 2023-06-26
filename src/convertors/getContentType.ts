import { CE_FORM_CONTENT_TYPE } from '#interfaces/CE_FORM_CONTENT_TYPE';
import pickContentType from '#tools/pickContentType';
import type { AxiosRequestConfig } from 'axios';
import { first } from 'my-easy-fp';

export default function getContentType(header: AxiosRequestConfig['headers']): string {
  const rawContentType = pickContentType(header)?.toLowerCase();

  const contentType =
    rawContentType == null || rawContentType === ''
      ? CE_FORM_CONTENT_TYPE.JSON
      : rawContentType.toLowerCase();

  const parts = contentType.split(';').map((part) => part.trim());
  const firstParts = first(parts);
  return firstParts;
}
