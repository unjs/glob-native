# glob-native

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]
[![Codecov][codecov-src]][codecov-href]

> A polyfill package to replicate the functionality of the experimental `fs.glob`

> [!WARNING]
> This package is not yet reliable enough to use, not least because the node `fs.glob` implementation seems to have some issues that need to be reported/fixed.

## 🚧 Roadmap

- [x] fsPromises.glob
- [ ] fs.glob
- [ ] fs.globSync

## Usage

Install package:

```sh
npm install glob-native
```

```js
import { fspGlob as glob } from 'glob-native'

for await (const entry of glob('**/*.js')) {
  console.log(entry)
}
```

## 💻 Development

- Clone this repository
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with ❤️

Published under [MIT License](./LICENCE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/glob-native?style=flat-square
[npm-version-href]: https://npmjs.com/package/glob-native
[npm-downloads-src]: https://img.shields.io/npm/dm/glob-native?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/glob-native
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/unjs/glob-native/ci.yml?branch=main&style=flat-square
[github-actions-href]: https://github.com/unjs/glob-native/actions?query=workflow%3Aci
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/glob-native/main?style=flat-square
[codecov-href]: https://codecov.io/gh/unjs/glob-native
