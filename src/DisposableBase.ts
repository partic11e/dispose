/**
 * Contains the abstract class DisposableBase.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
//  #endregion

//  #region feature-import-local
import { ObjectDisposedException } from "./exceptions/ObjectDisposedException.ts";
//  #endregion

//  #region type-import-remote
//  #endregion

//  #region type-import-local
import { IDisposable } from "./types/mod.ts";
//  #endregion

//  #region constants-local
//  #endregion

//  #region type-export-file
//  #endregion

// #region feature-export-file
/**
 * **An abstract class intended to be a base class of other classes and
 * cannot be instantiated on its own.**
 *
 * An abstract class implementation of the `IDisposable` interface.
 */
export abstract class DisposableBase implements IDisposable {
  //  #region static-properties
  //  #endregion

  //  #region static-methods
  /**
   * Asserts that `disposable`, an `DisposableBase` instance, has not been
   * disposed, optionally with a specific message.
   *
   * @param disposable The `DisposableBase` to assert has not disposed of its
   *    unmanaged resources.
   * @param message An optional exception message if `disposable` is disposed.
   */
  public static assertNotDisposed(
    disposable: DisposableBase,
    message?: string,
  ): void {
    disposable.assertNotDisposed(message);
  }
  //  #endregion

  //  #region constructors
  //  #endregion

  //  #region properties
  /**
   * Whether this `DisposableBase`'s resources have been freed up.
   */
  public get hasDisposed(): boolean {
    return this._hasDisposed;
  }
  //  #endregion

  //  #region interface-implementations
  //  #endregion

  //  #region abstract-methods
  //  #endregion

  //  #region method-overrides
  //  #endregion

  //  #region native-overrides
  /**
   * Returns the string representation of this `DisposableBase`.
   *
   * @returns The string representation of this `DisposableBase`.
   */
  public toString() {
    const { hasDisposed, constructor } = this;
    return `[object ${constructor.name}{hasDisposed: ${hasDisposed}}]`;
  }
  //  #endregion

  //  #region methods
  /**
   * Initiates the process of freeing up unmanaged resources and finalizing
   * this `DisposableBase`.
   */
  public dispose(): void {
    if (this.hasDisposed) return;

    try {
      this.onDispose();
    } finally {
      this._hasDisposed = true;
    }
  }
  //  #endregion

  //  #region _static-properties
  //  #endregion

  //  #region _static-methods
  //  #endregion

  //  #region _properties
  /**
   * Internal placeholder value for `hasDisposed`.
   */
  protected _hasDisposed = false;
  //  #endregion

  //  #region _method-overrides
  //  #endregion

  //  #region _methods
  /**
   * Asserts that this object has not been disposed, optionally with a
   * specific message.
   *
   * @param message An optional exception message if this `DisposableBase` is
   *    disposed.
   */
  protected assertNotDisposed(message?: string): void {
    if (this.hasDisposed) {
      const exception = message
        ? new ObjectDisposedException(message, {
          className: this.constructor.name,
        })
        : new ObjectDisposedException({ className: this.constructor.name });

      throw exception;
    }
  }
  /**
   * The handler method for freeing up resources when `dispose()` is called.
   *
   * Method should be overridden when a subclass of `DisposableBase` is
   * implemented to free up unmanaged resources.
   */
  protected onDispose(): void {}
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
// #endregion
