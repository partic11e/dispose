/**
 * Contains the class {@link DisposablePool}.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import { IDisposable } from "./types.ts";

import { DisposableBase } from "./DisposableBase.ts";
import { dispose } from "./dispose.ts";

/**
 * A class for collecting independant {@link IDisposable}s into a single
 * {@link DisposablePool}.
 */
export class DisposablePool<T extends { [key: string]: IDisposable }>
  extends DisposableBase {
  /**
   * The resources within the {@link DisposablePool}.
   */
  public get resources(): T | undefined {
    return this._disposables;
  }

  /**
   * The pool of {@link IDisposable} objects.
   */
  protected _disposables: T | undefined;

  /**
   * Creates a new instance of {@link DisposablePool}, with the collection of
   * {@link IDisposable}, `disposables`, to pool together.
   *
   * @param disposables The keyed collection of {@link IDisposable} objects to
   *    pool together.
   */
  constructor(disposables: T) {
    super();

    this._disposables = disposables;
  }

  /**
   * A convenience method to use the pool of {@link IDisposable}s in a
   * callback, which upon completion, will dispose of the pool of
   * {@link IDisposable}s and this {@link DisposablePool}.
   *
   * @param callback The callback to run on the pool of {@link IDisposable}s
   *    before being disposed.
   * @returns This {@link DisposablePool}.
   */
  public use(callback: (disposables: T) => void): this {
    this.assertNotDisposed();

    const { resources } = this;

    try {
      if (resources) {
        callback(resources);
      }
    } finally {
      this.dispose();
    }

    return this;
  }

  /**
   * A convenience method to use the pool of {@link IDisposable}s in a
   * callback, which upon completion, will dispose of the pool of
   * {@link IDisposable}s and this {@link DisposablePool}.
   *
   * This is simply an asynchronous method of `use()` for using features of the
   * pool of {@link IDisposable} s that may be asynchronous.
   *
   * @param callback The `async` callback to run on the pool of
   *    {@link IDisposable}s before being disposed.
   * @returns This {@link DisposablePool}.
   */
  async useAsync(callback: (disposables: T) => Promise<void>): Promise<this> {
    this.assertNotDisposed();

    const { resources } = this;

    try {
      if (resources) {
        await callback(resources);
      }
    } finally {
      this.dispose();
    }

    return this;
  }

  /**
   * Disposes the pool of {@link IDisposable}s, then disposes this
   * {@link DisposablePool}.
   */
  protected onDispose() {
    this.assertNotDisposed();

    const { resources } = this;

    if (resources) {
      Object.keys(resources).forEach((key) => {
        dispose(resources[key]);
      });
    }

    this._disposables = undefined;
  }
}
