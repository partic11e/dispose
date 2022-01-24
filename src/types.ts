/**
 * Contains the shared types for dispose module in the particle11 core
 * library.
 *
 * @copyright 2021-2022 IntegerEleven. All rights reserved. MIT license.
 */

/**
 * An interface describing features for freeing unmanaged resources.
 */
export interface IDisposable {
  /**
   * Performs actions to free unmanaged resources.
   */
  dispose(): void;
}
