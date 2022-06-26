/**
 * Test the features of the {@link functions}.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
import { assert, assertEquals, assertExists, assertRejects, Testing } from "../dev_deps.ts";
//  #endregion

//  #region feature-import-local
import { dispose, using, usingAsync } from "../mod.ts";
//  #endregion

//  #region type-import-remote
//  #endregion

//  #region type-import-local
//  #endregion

//  #region constants-local
const { TestSuite, Test } = Testing.decorators;
//  #endregion

//  #region test-fixture-import
import { DisposableNest, DisposeTestDisposable, Fetcher, IPerson, IPlanet, IProperties, IResult } from "./_fixtures/mod.ts";
//  #endregion

//  #region tests
@TestSuite("functions")
class FunctionsTest {
  @Test("dispose(...disposables)")
  public testDispose() {
    const disposable1 = new DisposeTestDisposable("Disposable1");
    const disposable2 = new DisposeTestDisposable("Disposable2");
    const disposable3 = new DisposeTestDisposable("Disposable3");
    const disposable4 = new DisposeTestDisposable("Disposable4");
    const disposable5 = new DisposeTestDisposable("Disposable5");

    assertExists(disposable1.name);
    assertExists(disposable2.name);
    assertExists(disposable3.name);
    assertExists(disposable4.name);
    assertExists(disposable5.name);
    assertEquals(disposable1.name, "Disposable1");
    assertEquals(disposable2.name, "Disposable2");
    assertEquals(disposable3.name, "Disposable3");
    assertEquals(disposable4.name, "Disposable4");
    assertEquals(disposable5.name, "Disposable5");

    dispose(disposable1, disposable2, disposable3, disposable4, disposable5);

    assertEquals(disposable1.name, undefined);
    assertEquals(disposable2.name, undefined);
    assertEquals(disposable3.name, undefined);
    assertEquals(disposable4.name, undefined);
    assertEquals(disposable5.name, undefined);
  }

  @Test("using(disposable,callback)")
  public testUsing() {
    const origDb = new DisposableNest("Database");
    const origQry = origDb.spawnChild("Query");
    const origEx = origQry.spawnChild("Executor");
    using(origDb, (db) => {
      using(origQry, (qry) => {
        using(origEx, (ex) => {
          assertEquals(db.parent, undefined);
          assertExists(qry.parent);
          assertExists(ex.parent);
          assert(!db.hasDisposed);
          assert(!qry.hasDisposed);
          assert(!ex.hasDisposed);
        });

        assertEquals(db.parent, undefined);
        assertExists(qry.parent);
        assertEquals(origEx.parent, undefined);
        assert(!db.hasDisposed);
        assert(!qry.hasDisposed);
        assert(origEx.hasDisposed);
      });

      assertEquals(db.parent, undefined);
      assertEquals(origQry.parent, undefined);
      assertEquals(origEx.parent, undefined);
      assert(!db.hasDisposed);
      assert(origQry.hasDisposed);
      assert(origEx.hasDisposed);
    });

    assertEquals(origDb.parent, undefined);
    assertEquals(origQry.parent, undefined);
    assertEquals(origEx.parent, undefined);
    assert(origDb.hasDisposed);
    assert(origQry.hasDisposed);
    assert(origEx.hasDisposed);
  }

  @Test("usingAsync(disposable,callback)")
  public async testUsingAsync() {
    const luke = new Fetcher<IResult<IProperties<IPerson>>>(
      "https://www.swapi.tech/api/people/1/",
    );
    let homeworld: Fetcher<IResult<IProperties<IPlanet>>>;

    await usingAsync(luke, async (l) => {
      const lData = await l.fetch();
      assertEquals(lData.result.properties.name, "Luke Skywalker");

      homeworld = new Fetcher<IResult<IProperties<IPlanet>>>(
        lData.result.properties.homeworld,
      );

      await usingAsync(homeworld, async (h) => {
        const hData = await h.fetch();
        assertEquals(hData.result.properties.name, "Tatooine");
      });

      assert(homeworld.hasDisposed);
      await assertRejects(async () => {
        await homeworld.fetch();
      });
      await assertRejects(async () => {
        await homeworld.refresh();
      });
    });

    assert(luke.hasDisposed);
    await assertRejects(async () => {
      await luke.fetch();
    });
    await assertRejects(async () => {
      await luke.refresh();
    });
  }
}
//  #endregion

Testing(FunctionsTest);
