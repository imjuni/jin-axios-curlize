import { generateBody } from '#/generators/generateBody';
import type { ICurlizeOptions, TBodyReplacerType } from '#/interfaces/ICurlizeOptions';
import { describe, expect, it } from 'vitest';

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
