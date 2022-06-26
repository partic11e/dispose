/**
 * Test the features of the {@link AbortedException}.
 *
 * The majority of the functionality for Exception is tested in the Exception
 * tests. This test only test feature differences caused by the the differing
 * code, messaging, and `ExceptionInit` properties.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
import { assertEquals, ExceptionSerializationData as esd, P11_EXC_KB, Testing } from "../dev_deps.ts";
//  #endregion

//  #region feature-import-local
import { ObjectDisposedException } from "../mod.ts";
//  #endregion

//  #region type-import-remote
//  #endregion

//  #region type-import-local
//  #endregion

//  #region constants-local
const { TestSuite, Test } = Testing.decorators;

const exCode = 22;
const exName = "ObjectDisposedException";
const objectName = "SomeObject";
//  #endregion

//  #region test-fixture-import
import type { ObjectDisposedExceptionInit } from "../mod.ts";
//  #endregion

//  #region tests
@TestSuite("ObjectDisposedException")
class ObjectDisposedExceptionTest {
  @Test("()")
  public testWithNoArgs() {
    const exMsg = "An action was attempted on a disposed object.";
    const ex = new ObjectDisposedException();
    const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
    const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${encodeURIComponent(exMsg)}`;

    assertEquals(ex.name, exName);
    assertEquals(ex.code, exCode);
    assertEquals(ex.data, undefined);
    assertEquals(ex.message, exMsg);
    assertEquals(ex.toString(), ex2String);
    assertEquals(ex.helpUrl, exHelpUrl);
  }

  @Test("(init)")
  public testWithInit() {
    const exMsg = 'An action was attempted on the disposed object "SomeObject".';
    const ex = new ObjectDisposedException({ objectName });
    const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
    const dataEncoded = encodeURIComponent(JSON.stringify({ objectName }));
    const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${encodeURIComponent(exMsg)}&${esd.data}=${dataEncoded}`;

    assertEquals(ex.name, exName);
    assertEquals(ex.code, exCode);
    assertEquals(ex.data, { objectName });
    assertEquals(ex.message, exMsg);
    assertEquals(ex.toString(), ex2String);
    assertEquals(ex.helpUrl, exHelpUrl);
  }

  @Test("(message")
  public testWithMessage() {
    const exMsg = 'An action was attempted on the disposed object "SomeObject".';
    const ex = new ObjectDisposedException(exMsg);
    const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
    const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${encodeURIComponent(exMsg)}`;

    assertEquals(ex.name, exName);
    assertEquals(ex.code, exCode);
    assertEquals(ex.data, undefined);
    assertEquals(ex.message, exMsg);
    assertEquals(ex.toString(), ex2String);
    assertEquals(ex.helpUrl, exHelpUrl);
  }

  @Test("(message, init)")
  public testWithMessageAndInit() {
    const exMsg = 'An action was attempted on the disposed object "SomeObject".';
    const data: ObjectDisposedExceptionInit = { objectName };
    const dataEncoded = encodeURIComponent(JSON.stringify(data));

    const ex = new ObjectDisposedException(exMsg, data);
    const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
    const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${encodeURIComponent(exMsg)}&${esd.data}=${dataEncoded}`;

    assertEquals(ex.name, exName);
    assertEquals(ex.code, exCode);
    assertEquals(ex.data, data);
    assertEquals(ex.message, exMsg);
    assertEquals(ex.toString(), ex2String);
    assertEquals(ex.helpUrl, exHelpUrl);
  }
}
//  #endregion

Testing(ObjectDisposedExceptionTest);
