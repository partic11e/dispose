/**
 * Contains features for using and disposing of {@link IDisposable}s.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

import type { Exception } from "../deps.ts";

import type { IDisposable } from "./types.ts";

/**
 * Accepts an array of {@link IDisposable}s and disposes of them, returning any
 * exceptions that may have occrred during disposal.
 *
 * @param disposables The {@link IDisposable}s to dispose.
 * @returns A list of exceptions that occured, if any.
 */
const _dispose = (
  disposables: IDisposable[],
): (Error | Exception)[] | undefined => {
  const exceptions: (Error | Exception)[] = [];

  for (let i = 0; i < disposables.length; i++) {
    const disposable = disposables[i];
    const ex = _disposeOne(disposable);

    if (ex) exceptions.push(ex);

    continue;
  }

  return exceptions.length ? exceptions : undefined;
};

/**
 * Accepts a {@link IDisposable}s and disposes of it, returning the exception
 * that occurred, if any, during disposal.
 *
 * @param disposables The {@link IDisposable} to dispose.
 * @returns The exceptions that occured, if any.
 */
const _disposeOne = (
  disposable: IDisposable,
): Error | Exception | undefined => {
  try {
    disposable.dispose();

    return;
  } catch (err) {
    return err;
  }
};

/**
 * Accepts an array of {@link IDisposable}s and disposes of them, returning any
 * exceptions that may have occrred during disposal.
 *
 * @param disposables The {@link IDisposable}s to dispose.
 * @returns A list of exceptions that occured, if any.
 */
export const dispose = (
  ...disposables: IDisposable[]
): (Error | Exception)[] | undefined => {
  return _dispose(disposables);
};

/**
 * Accepts an {@link IDisposable}s, `disposable`, and a `callback` function,
 * providing `disposable` as an argument to the `callback`, disposing the
 * `disposable` when the `callback` has completed.
 *
 * @param disposable The {@link IDisposable} to use and then dispose.
 * @param callback The callback function to apply to the `disposable` before
 *    disposal.
 * @returns A list of exceptions that occured, if any.
 */
export function using<T extends IDisposable, R>(
  disposable: T,
  callback: (disposable: T) => R,
): R {
  try {
    return callback(disposable);
  } finally {
    _disposeOne(disposable);
  }
}

/**
 * Asynchronously accepts an {@link IDisposable}s, `disposable`, and a
 * `callback` function, providing `disposable` as an argument to the
 * `callback`, disposing the `disposable` when the `callback` has
 * completed.
 *
 * @param disposable The {@link IDisposable} to use and then dispose.
 * @param callback The callback function to apply to the `disposable` before
 *    disposal.
 * @returns A list of exceptions that occured, if any.
 */
export async function usingAsync<T extends IDisposable, R>(
  disposable: T,
  callback: (disposable: T) => Promise<R>,
): Promise<R> {
  try {
    return await callback(disposable);
  } finally {
    _disposeOne(disposable);
  }
}
