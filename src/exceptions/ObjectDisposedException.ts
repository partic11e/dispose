/**
 * Contains the ObjectDisposedException class and associated types.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
import { Exception } from "../../deps.ts";
//  #endregion

//  #region feature-import-local
//  #endregion

//  #region type-import-remote
import type { ExceptionInit } from "../../deps.ts";
//  #endregion

//  #region type-import-local
//  #endregion

//  #region constants-local
/**
 * The default {@link ObjectDisposedException} message;
 */
const DEFAULT_MSG = "An action was attempted on a disposed object.";

/**
 * Creates and returns an {@link ObjectDisposedException} message based on
 * {@link ObjectDisposedExceptionInit} properties.
 *
 * @param init The {@link ObjectDisposedExceptionInit} information.
 * @returns The message constructed from `init`.
 */
const msgFromInit = (init: ObjectDisposedExceptionInit): string => {
  const { objectName } = init;

  return objectName ? `An action was attempted on the disposed object "${objectName}".` : DEFAULT_MSG;
};
//  #endregion

//  #region type-export-file
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
//  #endregion

/** */
export class ObjectDisposedException<
  T extends ObjectDisposedExceptionInit = ObjectDisposedExceptionInit,
> extends Exception<T> {
  //  #region static-properties
  //  #endregion

  //  #region static-methods
  //  #endregion

  //  #region constructors
  /**
   * Creates a new {@link ObjectDisposedException} with the default message,
   * "An unexpected error occurred", and no
   * exception init data.
   */
  constructor();
  /**
   * Creates a new {@link ObjectDisposedException} with a message created based on
   * {@link ObjectDisposedExceptionInit} properties.
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
  //  #endregion

  //  #region properties
  /**
   * The exception code for the {@link ObjectDisposedException} class.
   */
  public readonly code: number = 22;

  //  #endregion

  //  #region interface-implementations
  //  #endregion

  //  #region abstract-methods
  //  #endregion

  //  #region method-overrides
  //  #endregion

  //  #region native-overrides
  //  #endregion

  //  #region methods
  //  #endregion

  //  #region _static-properties
  //  #endregion

  //  #region _static-methods
  //  #endregion

  //  #region _properties
  //  #endregion

  //  #region _method-overrides
  //  #endregion

  //  #region _methods
  //  #endregion

  //  #region #static-methods
  //  #endregion

  //  #region #static-properties
  //  #endregion

  //  #region #methods
  //  #endregion

  //  #region #properties
  //  #endregion
}
