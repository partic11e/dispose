/**
 * Contains the class and types for creating an {@link ObjectDisposedException}.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import { Exception, ExceptionInit } from "../deps.ts";

/**
 * The default {@link ObjectDisposedException} message.
 */
const DEFAULT_MSG = "An action was attempted on a disposed object.";

/**
 * Creates and returns an {@link ObjectDisposedException} message based on
 * {@link AbortedExceptionInit} properties.
 *
 * @param init The {@link AObjectDisposedExceptionInit} information.
 * @returns The message constructed from `init`.
 */
const msgFromInit = (init: ObjectDisposedExceptionInit): string => {
  const { objectName } = init;

  return objectName
    ? `An action was attempted on the disposed object "${objectName}".`
    : DEFAULT_MSG;
};

/**
 * An interface describing the `init` properties for the
 * {@link ObjectDisposedException} class.
 */
export interface ObjectDisposedExceptionInit extends ExceptionInit {
  /**
   * The name of the object that was disposed.
   */
  objectName?: string;
}

/**
 * A class representing exceptions that occur when an operation has been
 * prematurely aborted.
 */
export class ObjectDisposedException<
  T extends ObjectDisposedExceptionInit = ObjectDisposedExceptionInit,
> extends Exception<T> {
  /**
   * The exception code for the {@link ObjectDisposedException} class.
   */
  public readonly code: number = 22;

  /**
   * Creates a new {@link ObjectDisposedException} with the default message,
   * "An action was attempted on a disposed object.", and no exception init
   * data.
   */
  constructor();
  /**
   * Creates a new {@link ObjectDisposedException} with a message created based
   * on {@link AbortedExceptionInit} properties.
   *
   * @param init The {@link ObjectDisposedExceptionInit} properties.
   */
  constructor(init: T);
  /**
   * Creates a new {@link ObjectDisposedException} with the supplied `message`,
   * optionally with additional {@link ObjectDisposedExceptionInit} properties.
   *
   * ***NOTE: `message` is not altered by the `init` properties.***
   *
   * @param message A message describing the exception.
   * @param init The {@link ObjectDisposedExceptionInit} properties.
   */
  constructor(message: string, init?: T);
  constructor(msgOrInit: string | T = DEFAULT_MSG, maybeInit?: T) {
    let message: string = msgOrInit as string;
    let init: T | undefined = maybeInit;

    if (typeof msgOrInit !== "string") {
      init = msgOrInit;
      message = msgFromInit(init);
    }

    super(message, init);
  }
}
