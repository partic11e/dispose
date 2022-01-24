/**
 * Tests the features of the {@link DisposablePool}.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import { assert, assertEquals } from "../dev_deps.ts";

import { DisposablePool, IDisposable, using, usingAsync } from "../mod.ts";

import {
  ApiConnection,
  IFilm,
  IPerson,
  IProperties,
  IResult,
  IRoot,
} from "./_testdata/mod.ts";

class A implements IDisposable {
  name = "A";
  hasDisposed = false;
  dispose() {
    this.hasDisposed = true;
  }
}

class B implements IDisposable {
  name = "B";
  hasDisposed = false;
  dispose() {
    this.hasDisposed = true;
  }
}

class C implements IDisposable {
  name = "C";
  hasDisposed = false;
  dispose() {
    this.hasDisposed = true;
  }
}

Deno.test("DisposablePool - using()", () => {
  const a = new A();
  const b = new B();
  const c = new C();
  const pool = new DisposablePool({ a, b, c });

  using(pool, ({ resources }) => {
    assert(resources);

    const { a, b, c } = resources;

    assertEquals(a.name, "A");
    assertEquals(b.name, "B");
    assertEquals(c.name, "C");
  });

  assert(pool.hasDisposed);
  assert(a.hasDisposed);
  assert(b.hasDisposed);
  assert(c.hasDisposed);
});

Deno.test("DisposablePool.use", () => {
  const a = new A();
  const b = new B();
  const c = new C();
  const pool = new DisposablePool({ a, b, c });

  pool.use(({ a, b, c }) => {
    assertEquals(a.name, "A");
    assertEquals(b.name, "B");
    assertEquals(c.name, "C");
  });

  assert(pool.hasDisposed);
  assert(a.hasDisposed);
  assert(b.hasDisposed);
  assert(c.hasDisposed);
});

Deno.test("DisposablePool.useAsync", async () => {
  const target = "https://www.swapi.tech/api";
  const rootApi = new ApiConnection(target, {
    "root": "",
  });
  let filmApi: ApiConnection<{ [key: string]: string }>;
  let personApi: ApiConnection<{ [key: string]: string }>;

  await usingAsync(rootApi, async (root) => {
    const resp = await root.get("root");
    const json = await resp.json() as IResult<IRoot>;

    filmApi = new ApiConnection("", { "all": json.result.films });
    personApi = new ApiConnection("", { "all": json.result.people });

    const pool = new DisposablePool({ filmApi, personApi });

    await pool.useAsync(async ({ filmApi, personApi }) => {
      const filmResp = await filmApi.get("all", 1);
      const filmJson: IResult<IProperties<IFilm>> = await filmResp.json();
      const personResp = await personApi.get("all", 1);
      const personJson: IResult<IProperties<IPerson>> = await personResp.json();

      assertEquals(personJson.result.properties.name, "Luke Skywalker");
      assertEquals(filmJson.result.properties.title, "A New Hope");
      assert(!pool.hasDisposed);
      assert(!filmApi.hasDisposed);
      assert(!personApi.hasDisposed);
    });

    assert(pool.hasDisposed);
    assert(filmApi.hasDisposed);
    assert(personApi.hasDisposed);
  });
});
