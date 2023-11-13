import getBody from '#convertors/getBody';
import getContentType from '#convertors/getContentType';
import getDefaultMultipartFormTransformer from '#convertors/getDefaultMultipartFormTransformer';
import generateBody from '#generators/generateBody';
import { CE_FORM_CONTENT_TYPE } from '#interfaces/CE_FORM_CONTENT_TYPE';
import type ICurlizeOptions from '#interfaces/ICurlizeOptions';
import type { TBodyReplacerType } from '#interfaces/ICurlizeOptions';
import pickContentType from '#tools/pickContentType';
import NodeFormData from 'form-data';
import { describe, expect, it } from 'vitest';

// mockup Node v18 or Browser FormData
// MDN: https://developer.mozilla.org/ko/docs/Web/API/FormData
class FormData extends Map<string, string | string[] | undefined> {}

describe('pick-content-type', () => {
  it('pass: pick-content-type', () => {
    const r01 = pickContentType({ 'Content-Type': CE_FORM_CONTENT_TYPE.JSON });
    const r02 = pickContentType({ 'content-type': CE_FORM_CONTENT_TYPE.MULTI_PART });
    const r03 = pickContentType({ 'Content-type': CE_FORM_CONTENT_TYPE.URL_ENCODE });
    const r04 = pickContentType({ 'content-Type': CE_FORM_CONTENT_TYPE.JSON });

    expect(r01).toEqual(CE_FORM_CONTENT_TYPE.JSON);
    expect(r02).toEqual(CE_FORM_CONTENT_TYPE.MULTI_PART);
    expect(r03).toEqual(CE_FORM_CONTENT_TYPE.URL_ENCODE);
    expect(r04).toEqual(CE_FORM_CONTENT_TYPE.JSON);
  });

  it('pass: pick-content-type', () => {
    const r01 = pickContentType({ 'cOntent-tYpe': CE_FORM_CONTENT_TYPE.JSON });

    expect(r01).toBeUndefined();
  });
});

describe('get-content-type', () => {
  it('form-type', () => {
    const r01 = getContentType({ 'content-type': 'application/x-www-form-urlencoded' });
    expect(r01).toEqual('application/x-www-form-urlencoded');
  });

  it('json-type-1', () => {
    const r01 = getContentType({ 'content-type': 'application/json' });
    expect(r01).toEqual('application/json');
  });

  it('json-type-2', () => {
    const r01 = getContentType({});
    expect(r01).toEqual('application/json');
  });
});

describe('get-body', () => {
  it('node-form-type', () => {
    const data = new NodeFormData();
    data.append('name', 'ironman');

    const body = getBody(
      {
        headers: {
          host: 'http://localhost',
          'content-type': 'application/x-www-form-urlencoded',
          'access-token': 'Bearer i-am-access-token',
        },
        data,
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: true,
      data: {},
    });
  });

  it('form-type', () => {
    const formData = new FormData();
    formData.set('name', 'ironman');
    formData.set('ability', `"energy repulsor","supersonic flight","Genius level intellect"`);

    const body = getBody(
      {
        headers: {
          host: 'http://localhost',
          'content-type': CE_FORM_CONTENT_TYPE.MULTI_PART,
          'access-token': 'Bearer i-am-access-token',
        },
        data: formData,
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: true,
      data: {
        name: 'ironman',
        ability: '"energy repulsor","supersonic flight","Genius level intellect"',
      },
    });
  });

  it('json-type', () => {
    const body = getBody(
      {
        headers: {
          host: 'http://localhost',
          'access-token': 'Bearer i-am-access-token',
        },
        data: { name: 'ironman' },
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: false,
      data: { name: 'ironman' },
    });
  });

  it('undefined', () => {
    const body = getBody(
      {
        headers: {
          host: 'http://localhost',
          'access-token': 'Bearer i-am-access-token',
        },
        data: undefined,
      },
      {
        prettify: true,
      },
    );

    expect(body).toMatchObject({
      form: false,
    });
  });
});

describe('generateBody', () => {
  it('json-body', () => {
    const body = generateBody(
      {},
      {
        form: false,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      {
        prettify: false,
      },
    );

    expect(body).toMatchObject([
      `--data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    ]);
  });

  it('form-body', () => {
    const body = generateBody(
      {},
      {
        form: true,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      {
        prettify: false,
      },
    );

    expect(body).toMatchObject([
      `--data name='ironman'`,
      `--data ability='energy repulsor'`,
      `--data ability='supersonic flight'`,
    ]);
  });

  it('form-body + replacer', () => {
    const bodyReplacer: TBodyReplacerType<Record<string, string | string[]>> = (_header, data) => {
      const next = { ...data };
      next.name = 'hello';
      return next;
    };

    const option: ICurlizeOptions<Record<string, string | string[]>> = {
      prettify: false,
      replacer: {
        body: bodyReplacer,
      },
    };

    const body = generateBody(
      {},
      {
        form: true,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      option,
    );

    expect(body).toMatchObject([
      `--data name='hello'`,
      `--data ability='energy repulsor'`,
      `--data ability='supersonic flight'`,
    ]);
  });

  it('form-body + replacer + exception', () => {
    const bodyReplacer: TBodyReplacerType<Record<string, string | string[]>> = (_header, data) => {
      const next = { ...data };

      if (data != null) {
        throw new Error('invalid data');
      }

      return next;
    };

    const option: ICurlizeOptions<Record<string, string | string[]>> = {
      prettify: false,
      replacer: {
        body: bodyReplacer,
      },
    };

    const body = generateBody(
      {},
      {
        form: true,
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
      },
      option,
    );

    expect(body).toMatchObject([
      `--data name='ironman'`,
      `--data ability='energy repulsor'`,
      `--data ability='supersonic flight'`,
    ]);
  });

  it('undefined-body', () => {
    const body = generateBody(
      {},
      {
        form: true,
        data: undefined,
      },
      {
        prettify: false,
      },
    );

    expect(body).toMatchObject([]);
  });
});

describe('getDefaultMultipartFormTransformer', () => {
  it('skip', () => {
    const formData = new NodeFormData();
    formData.append('name', 'ironman');
    formData.append('ability', `"energy repulsor","supersonic flight","Genius level intellect"`);

    const data = getDefaultMultipartFormTransformer(
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: formData,
      },
      { prettify: true },
    );

    expect(data).toMatchObject({});
  });

  it('form-data', () => {
    const formData = new FormData();
    formData.set('name', 'ironman');
    formData.set('nobody1', undefined);
    formData.set('nobody2', '');
    formData.set('ability', `"energy repulsor","supersonic flight","Genius level intellect"`);

    const data = getDefaultMultipartFormTransformer(
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: formData,
      },
      { prettify: true },
    );

    expect(data).toMatchObject({
      name: 'ironman',
      ability: '"energy repulsor","supersonic flight","Genius level intellect"',
    });
  });

  it('json-data', () => {
    const data = getDefaultMultipartFormTransformer(
      {
        headers: {
          'content-type': CE_FORM_CONTENT_TYPE.JSON,
        },
        data: {
          name: 'ironman',
          ability: '"energy repulsor","supersonic flight","Genius level intellect"',
        },
      },
      { prettify: true },
    );

    expect(data).toMatchObject({
      name: 'ironman',
      ability: '"energy repulsor","supersonic flight","Genius level intellect"',
    });
  });
});
