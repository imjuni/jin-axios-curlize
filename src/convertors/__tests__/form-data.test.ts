import { getFormData } from '#/convertors/getFormData';
import NodeFormData from 'form-data';
import { describe, expect, it } from 'vitest';

// mockup Node v18 or Browser FormData
// MDN: https://developer.mozilla.org/ko/docs/Web/API/FormData
class FormData extends Map<string, string | string[] | undefined> {}

describe('get-form-data', () => {
  it('form-type', () => {
    const formData = new NodeFormData();
    formData.append('name', 'ironman');

    const r01 = getFormData(formData);

    expect(r01).toMatchObject({});
  });

  it('form-type-mock', () => {
    const formData = new FormData();
    formData.set('name', 'ironman');

    const r01 = getFormData(formData);

    expect(r01).toMatchObject({
      name: 'ironman',
    });
  });

  it('unknown', () => {
    const r01 = getFormData({});

    expect(r01).toMatchObject({});
  });
});
