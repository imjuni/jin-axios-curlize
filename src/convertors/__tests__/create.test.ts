import createFromAxios from '#convertors/createFromAxios';
import { CE_FORM_CONTENT_TYPE } from '#interfaces/CE_FORM_CONTENT_TYPE';
import NodeFormData from 'form-data';

// mockup Node v18 or Browser FormData
// MDN: https://developer.mozilla.org/ko/docs/Web/API/FormData
class FormData extends Map<string, string | string[] | undefined> {}

describe('create-from-axios', () => {
  it('error', () => {
    expect(() => {
      createFromAxios(
        {
          url: undefined,
        },
        { prettify: false },
      );
    }).toThrowError();
  });

  it('get no-param', () => {
    const formData = new NodeFormData();
    formData.append('name', 'ironman');

    const r01 = createFromAxios(
      {
        url: 'http://localhost',
      },
      { prettify: false },
    );

    expect(r01).toEqual(`curl -X GET 'http://localhost/'`);
  });

  it('get node-stream-form-data', () => {
    const formData = new NodeFormData();
    formData.append('name', 'ironman');

    const r01 = createFromAxios(
      {
        url: 'hero',
        baseURL: 'http://localhost',
        data: formData,
        headers: {
          'Content-Type': CE_FORM_CONTENT_TYPE.MULTI_PART,
        },
      },
      { prettify: false },
    );

    expect(r01).toEqual(
      `curl -X GET 'http://localhost/hero' --header 'Content-Type: multipart/form-data'`,
    );
  });

  it('post browser-form-data', () => {
    const formData = new FormData();
    formData.set('name', 'ironman');
    formData.set('ability', `"energy repulsor","supersonic flight","Genius level intellect"`);

    const r01 = createFromAxios(
      {
        url: 'hero',
        method: 'post',
        baseURL: 'http://localhost',
        data: formData,
        headers: {
          'Content-Type': CE_FORM_CONTENT_TYPE.MULTI_PART,
        },
      },
      { prettify: false },
    );

    expect(r01).toEqual(
      `curl -X POST 'http://localhost/hero' --header 'Content-Type: multipart/form-data' --data name='ironman' --data ability='"energy repulsor","supersonic flight","Genius level intellect"'`,
    );
  });

  it('post browser-form-data', () => {
    const r01 = createFromAxios(
      {
        url: 'hero',
        method: 'post',
        baseURL: 'http://localhost',
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
        headers: {
          'Content-Type': CE_FORM_CONTENT_TYPE.JSON,
        },
      },
      { prettify: false },
    );

    expect(r01).toEqual(
      `curl -X POST 'http://localhost/hero' --header 'Content-Type: application/json' --data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    );
  });

  it('get querystring', () => {
    const r01 = createFromAxios(
      {
        url: 'hero',
        method: 'post',
        baseURL: 'http://localhost',
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
        headers: {
          'Content-Type': CE_FORM_CONTENT_TYPE.JSON,
        },
      },
      { prettify: false },
    );

    expect(r01).toEqual(
      `curl -X POST 'http://localhost/hero' --header 'Content-Type: application/json' --data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    );
  });

  it('get querystring + --location', () => {
    const r01 = createFromAxios(
      {
        url: 'hero',
        method: 'post',
        baseURL: 'http://localhost',
        data: { name: 'ironman', ability: ['energy repulsor', 'supersonic flight'] },
        headers: {
          'Content-Type': CE_FORM_CONTENT_TYPE.JSON,
        },
      },
      { prettify: false, disableFollowRedirect: true },
    );

    expect(r01).toEqual(
      `curl -X POST 'http://localhost/hero' --location --header 'Content-Type: application/json' --data $'{"name":"ironman","ability":["energy repulsor","supersonic flight"]}'`,
    );
  });
});
