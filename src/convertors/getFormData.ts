import type NodeFormData from 'form-data';

export default function getFormData(formData: unknown): Record<string, string> {
  if ('getHeaders' in (formData as NodeFormData)) {
    return {};
  }

  if (formData?.constructor?.name === 'FormData') {
    return Array.from((formData as FormData).entries()).reduce((aggregation, [key, value]) => {
      return { ...aggregation, [key]: value };
    }, {});
  }

  return {};
}
