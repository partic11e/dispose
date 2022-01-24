/**
 * Tests the features of the {@link ObjectDisposedException}.
 *
 * The majority of the functionality for Exception is tested in the Exception
 * tests. This test only test feature differences caused by the the differing
 * code, messaging, and `ExceptionInit` properties.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import {
  assertEquals,
  ExceptionSerializationData as esd,
  P11_EXC_KB,
} from "../dev_deps.ts";

import {
  ObjectDisposedException,
  ObjectDisposedExceptionInit,
} from "../mod.ts";

const exCode = 22;
const exName = "ObjectDisposedException";
const objectName = "SomeObject";

Deno.test("ObjectDisposedException()", () => {
  const exMsg = "An action was attempted on a disposed object.";
  const ex = new ObjectDisposedException();
  const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
  const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${
    encodeURIComponent(exMsg)
  }`;

  assertEquals(ex.name, exName);
  assertEquals(ex.code, exCode);
  assertEquals(ex.data, undefined);
  assertEquals(ex.message, exMsg);
  assertEquals(ex.toString(), ex2String);
  assertEquals(ex.helpUrl, exHelpUrl);
});

Deno.test("ObjectDisposedException({objectName})", () => {
  const exMsg =
    `An action was attempted on the disposed object "${objectName}".`;
  const data: ObjectDisposedExceptionInit = { objectName };
  const dataEncoded = encodeURIComponent(JSON.stringify(data));

  const ex = new ObjectDisposedException(data);
  const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
  const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${
    encodeURIComponent(exMsg)
  }&${esd.data}=${dataEncoded}`;

  assertEquals(ex.name, exName);
  assertEquals(ex.code, exCode);
  assertEquals(ex.data, data);
  assertEquals(ex.message, exMsg);
  assertEquals(ex.toString(), ex2String);
  assertEquals(ex.helpUrl, exHelpUrl);
});

Deno.test("ObjectDisposedException(message)", () => {
  const exMsg = "An action was attempted on a disposed object.";
  const ex = new ObjectDisposedException(exMsg);
  const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
  const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${
    encodeURIComponent(exMsg)
  }`;

  assertEquals(ex.name, exName);
  assertEquals(ex.code, exCode);
  assertEquals(ex.data, undefined);
  assertEquals(ex.message, exMsg);
  assertEquals(ex.toString(), ex2String);
  assertEquals(ex.helpUrl, exHelpUrl);
});

Deno.test("ObjectDisposedException(message, {objectName})", () => {
  const exMsg = "An action was attempted on the disposed object.";
  const data: ObjectDisposedExceptionInit = { objectName };
  const dataEncoded = encodeURIComponent(JSON.stringify(data));
  const ex = new ObjectDisposedException(exMsg, data);
  const ex2String = `${exName} [0x${exCode.toString(16)}]: ${exMsg}`;
  const exHelpUrl = `${P11_EXC_KB}/0x${exCode.toString(16)}?${esd.message}=${
    encodeURIComponent(exMsg)
  }&${esd.data}=${dataEncoded}`;

  assertEquals(ex.name, exName);
  assertEquals(ex.code, exCode);
  assertEquals(ex.data, data);
  assertEquals(ex.message, exMsg);
  assertEquals(ex.toString(), ex2String);
  assertEquals(ex.helpUrl, exHelpUrl);
});
