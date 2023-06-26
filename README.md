# jin-axios-curlize

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/jin-axios-curlize.svg?style=flat-square)](https://npmcharts.com/compare/jin-axios-curlize?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/jin-axios-curlize.svg?style=flat-square)](https://github.com/imjuni/jin-axios-curlize)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/jin-axios-curlize.svg?style=flat-square)](https://github.com/imjuni/jin-axios-curlize/issues)
[![NPM version](https://img.shields.io/npm/v/jin-axios-curlize.svg?style=flat-square)](https://www.npmjs.com/package/jin-axios-curlize)
[![License](https://img.shields.io/npm/l/jin-axios-curlize.svg?style=flat-square)](https://github.com/imjuni/jin-axios-curlize/blob/master/LICENSE)
[![ci](https://github.com/imjuni/jin-axios-curlize/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/imjuni/jin-axios-curlize/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/imjuni/jin-axios-curlize/branch/master/graph/badge.svg?style=flat-square&token=R7R2PdJcS9)](https://codecov.io/gh/imjuni/jin-axios-curlize)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

jin-axios-curlize create curl command from AxiosRequestConfig.

Why?

1. automatic create curl command from AxiosRequestConfig
1. Quickly repeat error request
1. Support querystring, header, body replacer
1. work without intercepter, no need to request execute for curl command creation

## Table of Contents <!-- omit in toc -->

- [installation](#installation)
- [How to works?](#how-to-works)
- [Usage](#usage)
- [Options](#options)
- [How do I add transaction id on querystring?](#how-do-i-add-transaction-id-on-querystring)
- [jin-curlize](#jin-curlize)

## installation

```bash
npm install jin-axios-curlize --save-dev
```

## How to works?

`jin-axios-curlize` create curl command from `AxiosRequestConfig`. For example,

- `AxiosRequestConfig`.`headers` to `--header` option
- `AxiosRequestConfig`.url and `AxiosRequestConfig`.params to querystring and href

```mermaid
flowchart LR
    IMH[AxiosRequestConfig] --> JC[jin-axios-curlize]
    JC --> C[curl command]
```

## Usage

```ts
import axios, { AxiosRequestConfig } from 'axios';
import { createFromAxios } from 'jin-axios-curlize';

const req: AxiosRequestConfig = {
  url: 'http://localhost:3000/v1/superhero/i-am-unique-id'
  method: 'put',
  data: {
    name: 'ironman'
  }
}

const reply = await axios.request(req);

console.log('curl command: ', createFromAxios(req));
// curl -X PUT 'http://localhost:3000/v1/superhero/i-am-unique-id' -d $'{"name":"ironman"}'
```

## Options

| Name                  | Requirement | Description                                                    |
| --------------------- | ----------- | -------------------------------------------------------------- |
| prettify              | require     | Apply prettifing. Add newline and backslash add on line-ending |
| indent                | optional    | Only work on prettify set true, make space size                |
| disableFollowRedirect | optional    | If set true, remove `--location` option from command           |
| replacer.querystring  | optional    | replacer for querystring                                       |
| replacer.body         | optional    | replacer for body                                              |
| replacer.header       | optional    | replacer for header                                            |

## How do I add transaction id on querystring?

```ts
import { createV3, encodeQuerystring } from 'jin-curlize';

createV3(req, {
  prettify: false,
  replacer: {
    querystring: (qs) => {
      const next = new URLSearchParams(qs);
      // add your transaction id on querystring, `uuidgen` is linux or macosx uuid generator command
      next.set('tid', `'"$(uuidgen)"'`);
      return encodeQuerystring(next);
    },
  },
});
```

## jin-curlize

If you want that curl command generate from FastifyRequest, use [jin-curlize](https://www.npmjs.com/package/jin-curlize) package.
