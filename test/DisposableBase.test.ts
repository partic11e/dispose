/**
 * Test the features of {@link DisposableBase}.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
import { assert, assertEquals, assertThrows, Testing } from "../dev_deps.ts";
//  #endregion

//  #region feature-import-local
import { usingAsync } from "../mod.ts";
//  #endregion

//  #region type-import-remote
//  #endregion

//  #region type-import-local
//  #endregion

//  #region constants-local
const { TestSuite, Test } = Testing.decorators;
//  #endregion

//  #region test-fixture-import
import { ApiConnection, IResult, IRoot } from "./_fixtures/mod.ts";
//  #endregion

//  #region tests
@TestSuite("DisposableBase")
class DisposableBaseTest {
  @Test("()")
  public async testWithNoArgs() {
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
  }
}

//  #endregion

Testing(DisposableBaseTest);
