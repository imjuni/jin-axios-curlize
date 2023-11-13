import { generateHeader } from '#/generators/generateHeader';
import { defaultHeaderFilterItems } from '#/tools/defaultHeaderFilterItems';
import type { AxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';

describe('generate-header', () => {
  it('undefined-type', () => {
    const header = generateHeader(undefined, { prettify: true });

    expect(header).toEqual([]);
  });

  it('string-type', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: application/x-www-form-urlencoded'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
    ]);
  });

  it('string-type refine-header-additional-field', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type':
          'multipart/form-data; boundary=--------------------------567807848329877144365887',
        'access-token': 'Bearer i-am-access-token',
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: multipart/form-data'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
    ]);
  });

  it('string-type refine-header-undefined', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type': undefined,
        'access-token': 'Bearer i-am-access-token',
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: application/json'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
    ]);
  });

  it('string[]-type', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
      },
      { prettify: true },
    );

    expect(header).toEqual([
      `  --header 'content-type: application/x-www-form-urlencoded'`,
      `  --header 'access-token: Bearer i-am-access-token'`,
      `  --header 'referers: http://site1,http://site2'`,
    ]);
  });

  it('string[]-type+array', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      { prettify: false },
    );

    expect(header).toEqual([
      `--header 'content-type: application/x-www-form-urlencoded'`,
      `--header 'access-token: Bearer i-am-access-token'`,
      `--header 'referers: http://site1,http://site2'`,
      `--header 'user:  '`,
    ]);
  });

  it('replacer-string[]-type+array', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      {
        prettify: false,
        replacer: {
          header: (arc: AxiosRequestConfig['headers']) => {
            const next = Object.entries(arc as Record<string, string>)
              .filter(
                ([key]) =>
                  !(defaultHeaderFilterItems as readonly string[]).includes(
                    key.trim().toLowerCase(),
                  ),
              )
              .reduce<Record<string, string>>((agg, [key, value]) => {
                return { ...agg, [key]: value };
              }, {});

            delete next.user;
            return next;
          },
        },
      },
    );

    expect(header).toEqual([
      `--header 'content-type: application/x-www-form-urlencoded'`,
      `--header 'access-token: Bearer i-am-access-token'`,
      `--header 'referers: http://site1,http://site2'`,
    ]);
  });

  it('replacer-string[] + exception+type+array', () => {
    const header = generateHeader(
      {
        host: 'http://localhost',
        'content-type': 'application/x-www-form-urlencoded',
        'access-token': 'Bearer i-am-access-token',
        referers: ['http://site1', 'http://site2'],
        user: undefined,
      },
      {
        prettify: false,
        replacer: {
          header: (arg: AxiosRequestConfig['headers']) => {
            if (arg != null) {
              throw new Error('invalid data');
            }

            return arg;
          },
        },
      },
    );

    expect(header).toEqual([
      `--header 'content-type: application/x-www-form-urlencoded'`,
      `--header 'access-token: Bearer i-am-access-token'`,
      `--header 'referers: http://site1,http://site2'`,
      `--header 'user:  '`,
    ]);
  });

  it('replacer-undefined', () => {
    const header = generateHeader(
      {
        name: 'ironman',
      },
      {
        prettify: false,
        replacer: {
          header: (arg: AxiosRequestConfig['headers']) => {
            if (arg == null) {
              throw new Error('invalid data');
            }

            return undefined;
          },
        },
      },
    );

    expect(header).toEqual([]);
  });
});
