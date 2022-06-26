/**
 * Test the features of the {@link DisposablePool}.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
import { assert, assertEquals, Testing } from "../dev_deps.ts";
//  #endregion

//  #region feature-import-local
import { DisposablePool, using, usingAsync } from "../mod.ts";
//  #endregion

//  #region type-import-remote
import type { IDisposable } from "../mod.ts";
//  #endregion

//  #region type-import-local
//  #endregion

//  #region constants-local
const { TestSuite, Test } = Testing.decorators;
//  #endregion

//  #region test-fixture-import
import { ApiConnection, IFilm, IPerson, IProperties, IResult, IRoot } from "./_fixtures/mod.ts";

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
//  #endregion

//  #region tests
@TestSuite("DisposablePool")
class DisposablePoolTest {
  @Test("using(pool, callback)")
  public testUsing() {
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
  }

  @Test("DisposablePool.use(callback)")
  public testUse() {
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
  }

  @Test("DisposablePool.useAsync(callback)")
  public async testUseAsync() {
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
  }
}
//  #endregion

Testing(DisposablePoolTest);
