import { DisposableBase } from "../../mod.ts";

export class ApiConnection<T extends Record<string, string>>
  extends DisposableBase {
  #baseUrl?: string;
  #methodMappings?: T;

  constructor(baseUrl: string, methodMappings: T) {
    super();
    this.#baseUrl = baseUrl;
    this.#methodMappings = methodMappings;
  }

  public get(method?: keyof T, id?: number) {
    this.assertNotDisposed();
    const base = this.#baseUrl ? `${this.#baseUrl}` : "";
    const resolvedPath = this.resolvePath(method);

    return fetch(
      `${base}${resolvedPath}/${id !== undefined ? id : ""}`,
    );
  }

  public resolvePath(method?: keyof T): string {
    this.assertNotDisposed();
    if (this.#baseUrl === undefined) throw new Error();
    if (!this.#methodMappings) throw new Error();

    return this.#methodMappings[method as string] as string || "";
  }

  onDispose() {
    this.#baseUrl = undefined;
    this.#methodMappings = undefined;
  }
}
