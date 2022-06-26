/**
 * Contains the class DisposablePool.
 *
 * @copyright 2022 integer11. All rights reserved. MIT license.
 */

//  #region feature-import-remote
//  #endregion

//  #region feature-import-local
import { DisposableBase } from "./DisposableBase.ts";
import { dispose } from "./functions.ts";
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

/**
 * A class for collecting independant {@link IDisposable}s into a single
 * {@link DisposablePool}.
 */
export class DisposablePool<T extends { [key: string]: IDisposable }> extends DisposableBase {
  //  #region static-properties
  //  #endregion

  //  #region static-methods
  //  #endregion

  //  #region constructors

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
  //  #endregion

  //  #region properties
  /**
   * The resources within the {@link DisposablePool}.
   */
  public get resources(): T | undefined {
    return this._disposables;
  }
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
  //  #endregion

  //  #region _static-properties
  //  #endregion

  //  #region _static-methods
  //  #endregion

  //  #region _properties
  /**
   * The pool of {@link IDisposable} objects.
   */
  protected _disposables: T | undefined;

  //  #endregion

  //  #region _method-overrides
  //  #endregion

  //  #region _methods
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
