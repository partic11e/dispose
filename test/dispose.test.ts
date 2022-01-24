/**
 * Tests the features of dispose.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
} from "../dev_deps.ts";

import { dispose, using, usingAsync } from "../mod.ts";

import {
  DisposableNest,
  DisposeTestDisposable,
  Fetcher,
  IPerson,
  IPlanet,
  IProperties,
  IResult,
} from "./_testdata/mod.ts";

Deno.test("dispose(...disposables)", () => {
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
});

Deno.test("using(disposable, callback)", () => {
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
});

Deno.test("usingAsync(disposable, callback)", async () => {
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
});
