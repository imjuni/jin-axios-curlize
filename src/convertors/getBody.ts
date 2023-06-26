import getContentType from '#convertors/getContentType';
import getDefaultMultipartFormTransformer from '#convertors/getDefaultMultipartFormTransformer';
import { CE_FORM_CONTENT_TYPE } from '#interfaces/CE_FORM_CONTENT_TYPE';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { JSONObject } from '#interfaces/JSONValue';
import type { AxiosRequestConfig } from 'axios';

export default function getBody(
  req: Pick<AxiosRequestConfig, 'data' | 'headers'>,
  options: ICurlizeOptions,
): { form: boolean; data?: JSONObject } {
  const contentType = getContentType(req.headers);
  const isForm =
    contentType.includes(CE_FORM_CONTENT_TYPE.URL_ENCODE) ||
    contentType.includes(CE_FORM_CONTENT_TYPE.MULTI_PART);

  if (req.data == null) {
    return { form: isForm };
  }

  if (contentType === CE_FORM_CONTENT_TYPE.URL_ENCODE) {
    const body = getDefaultMultipartFormTransformer(req, options) as JSONObject;

    return { form: isForm, data: body };
  }

  if (contentType === CE_FORM_CONTENT_TYPE.MULTI_PART) {
    const body = getDefaultMultipartFormTransformer(req, options) as JSONObject;

    return { form: isForm, data: body };
  }

  return { form: isForm, data: req.data as JSONObject };
}
