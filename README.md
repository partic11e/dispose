<p align="center">
  <!-- Update log -->
  <img alt="partic11e logo" height="70" src="https://raw.githubusercontent.com/partic11e/.github/main/profile/p11/logotype.svg" />
  <strong>dispose</strong>
</p>

<p align="center">
  partic11e is a collection of easy-to-use utility and feature libraries for creating anything you want.
</p>

<h1 align="center">partic11e - dispose</h1>

<p align="center">
  The dispose module contains utilities and features for creating and managing disposable object.
</p>

<p align="center">
  <!-- Project links  -->
</p>

<p align="center">
  <sub>Built with ❤ by integer11 and <a href="https://github.com/partic11e/dispose/graphs/contributors">contributors</a></sub>
</p>

<p align="center">
  <!-- Badges -->
  <a href="CODE_OF_CONDUCT.md">
    <img alt="Contributor Covenant" src="https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg?style=flat-square" />
  </a>
  <a href="https://github.com/partic11e/dispose/commits/main">
    <img alt="Last GitHub commit" src="https://img.shields.io/github/last-commit/partic11e/dispose.svg?style=flat-square" />
  </a>
  <a href="https://github.com/partic11e/dispose/releases">
    <img alt="GitHub release (latest SemVer)" src="https://img.shields.io/github/v/release/partic11e/dispose?style=flat-square" />
  </a>
</p>

<!-- TOC -->

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Features

[(to top)](#table-of-contents)

- Disposable interface
- DisposablePool for disposing disposable collections
- using and usingAsync functions

## Installation

[(to top)](#table-of-contents)

To install, you simply need to re-export the library features with your `deps.ts` file.

```ts
export * from "https://denopkg.com/partic11e/dispose/mod.ts";
//  or specific features
```

and then import them from your `deps.ts` file into the files they are needed.

```ts
import { version } from "../deps.ts";
//  or other features
```

You can specify a specific release or branch in the re-export:

**Export from a specific release**\
`export * from "https://denopkg.com/partic11e/dispose@v0.1.0-alpha/mod.ts"`

**Export from a specific branch**\
`export * from "https://denopkg.com/partic11e/dispose@dev-fix-06145/mod.ts"`

**Export the latest release**\
`export * from "https://denopkg.com/partic11e/dispose@latest/mod.ts"`

> **Note that if no version is specified in the re-export, then it will pull from the main branch, which as we always release on a merge with the main.**

## Examples

[(to top)](#table-of-contents)

```ts
import { DisposableBase, usingAsync } from "../deps.ts";

const target = "https://www.swapi.tech/api";

export class ApiConnection<T extends Record<string, string>> extends DisposableBase {
  #baseUrl?: string;
  #methodMappings?: T;

  constructor(baseUrl: string, methodMappings: T) {
    super();
    this.#baseUrl = baseUrl;
    this.#methodMappings = methodMappings;
  }

  public get(method?: keyof T, id?: number) {
    this.assertNotDisposed();
    const base = this.#baseUrl ? `${this.#baseUrl}` : "";
    const resolvedPath = this.resolvePath(method);

    return fetch(
      `${base}${resolvedPath}/${id !== undefined ? id : ""}`,
    );
  }

  public resolvePath(method?: keyof T): string {
    this.assertNotDisposed();
    if (this.#baseUrl === undefined) throw new Error();
    if (!this.#methodMappings) throw new Error();

    return this.#methodMappings[method as string] as string || "";
  }

  onDispose() {
    this.#baseUrl = undefined;
    this.#methodMappings = undefined;
  }
}

const rootApi = new ApiConnect(target, { "root": "" });

usingAsync(rootApi, async (root) => {
  const resp = await root.get("root");
  const json = await resp.json();

  const swapi = new ApiConnection("", json.result);

  usingAsync(swapi, async (api) => {
    const resp = await api.get("films");
    const json = await resp.json();

    console.log(json);
    //  JSON from https://www.swapi.tech/api/films
  });
  console.log(rootApi.hasDisposed, swapi.hasDisposed);
  //  false, true
});

console.log(rootApi.hasDisposed);
//  true
```

## Contributing

[(to top)](#table-of-contents)

Contributions are welcome! Take a look at our [contributing guidelines](CONTRIBUTING.md) to get started.

## License

[(to top)](#table-of-contents)

The MIT License (MIT) 2022 &middot; integer11. Refer to [LICENSE](LICENSE) for details.
