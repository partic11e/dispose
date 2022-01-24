/**
 * Contains the abstract class {@link DisposableBase}.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import { IDisposable } from "./types.ts";

import { ObjectDisposedException } from "./ObjectDisposedException.ts";

/**
 * **This is an abstract class intended to be a base class of other classes and
 * cannot be instantiated on its own.**
 *
 * An abstract class implementation of the `IDisposable` interface.
 */
export abstract class DisposableBase implements IDisposable {
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

  /**
   * Whether this `DisposableBase`'s resources have been freed up.
   */
  public get hasDisposed(): boolean {
    return this._hasDisposed;
  }
  /**
   * Internal placeholder value for `hasDisposed`.
   */
  protected _hasDisposed = false;

  /**
   * Returns the string representation of this `DisposableBase`.
   *
   * @returns The string representation of this `DisposableBase`.
   */
  public toString() {
    const { hasDisposed, constructor } = this;
    return `[object ${constructor.name}{hasDisposed: ${hasDisposed}}]`;
  }

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
}
