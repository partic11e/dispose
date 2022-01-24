/**
 * Tests the features of the {@link DisposableBase}.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import { assert, assertEquals, assertThrows } from "../dev_deps.ts";

import { usingAsync } from "../mod.ts";

import { ApiConnection, IResult, IRoot } from "./_testdata/mod.ts";

Deno.test("DisposableBase", async () => {
  const target = "https://www.swapi.tech/api";
  const rootApi = new ApiConnection(target, {
    "root": "",
  });
  let swapi: ApiConnection<IRoot>;

  await usingAsync(rootApi, async (root) => {
    const resp = await root.get("root");
    const json = await resp.json() as IResult<IRoot>;

    assertEquals(rootApi, root);
    assert(!root.hasDisposed);

    await usingAsync(
      swapi = new ApiConnection("", json.result),
      async (api) => {
        const resp = await api.get("films");
        await resp.json();

        assertEquals(swapi, api);
        assertEquals(`${swapi}`, `[object ApiConnection{hasDisposed: false}]`);
        assert(!api.hasDisposed);
      },
    );

    assertEquals(`${swapi}`, `[object ApiConnection{hasDisposed: true}]`);
    assertThrows(() => ApiConnection.assertNotDisposed(swapi));
    assert(swapi.hasDisposed);
    assertEquals(`${rootApi}`, `[object ApiConnection{hasDisposed: false}]`);
  });

  assertEquals(`${rootApi}`, `[object ApiConnection{hasDisposed: true}]`);
  assertThrows(() => ApiConnection.assertNotDisposed(rootApi));
  assert(rootApi.hasDisposed);
});
