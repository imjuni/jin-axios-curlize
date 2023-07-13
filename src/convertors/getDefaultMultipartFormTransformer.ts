import getContentType from '#convertors/getContentType';
import getFormData from '#convertors/getFormData';
import { CE_FORM_CONTENT_TYPE } from '#interfaces/CE_FORM_CONTENT_TYPE';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { AxiosRequestConfig } from 'axios';

export default function getDefaultMultipartFormTransformer<T = unknown>(
  req: Pick<AxiosRequestConfig, 'data' | 'headers'>,
  options: ICurlizeOptions<T>,
) {
  const contentType = getContentType(req.headers);

  if (
    (contentType === CE_FORM_CONTENT_TYPE.URL_ENCODE ||
      contentType === CE_FORM_CONTENT_TYPE.MULTI_PART) &&
    options.replacer?.body == null
  ) {
    const body = getFormData(req.data as unknown);

    const refined = Object.entries(body)
      .map<Record<string, unknown>>(([key, value]) => {
        return { key, value };
      })
      .filter((entry): entry is { key: string; value: string } => typeof entry.value === 'string')
      .reduce<Record<string, string>>((aggregation, entry) => {
        if (entry.value === '') {
          return aggregation;
        }

        return { ...aggregation, [entry.key]: entry.value } satisfies Record<string, string>;
      }, {});

    return refined;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return req.data;
}
