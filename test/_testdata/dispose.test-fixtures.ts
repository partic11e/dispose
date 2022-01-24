import { IDisposable } from "../../mod.ts";

export interface IPerson {
  name: string;
  homeworld: string;
  [key: string]: string;
}

export interface IPlanet {
  name: string;
  [key: string]: string;
}

export interface IFilm {
  name: string;
  [key: string]: string;
}

export interface IRoot {
  films: string;
  people: string;
  planets: string;
  species: string;
  starships: string;
  vehicles: string;
  [key: string]: string;
}

export class DisposeTestDisposable<T> implements IDisposable {
  #hasDisposed = false;

  public name?: string;

  constructor(name: string) {
    this.name = name;
  }

  dispose() {
    try {
      if (this.name && this.name.indexOf("5") > -1) {
        throw new Error("Throwing an Error.");
      }
    } finally {
      this.name = undefined;
      this.#hasDisposed = true;
    }
  }
}

export class DisposableNest implements IDisposable {
  #parent?: DisposableNest;

  #hasDisposed = false;

  constructor(public readonly name: string, parent?: DisposableNest) {
    this.#parent = parent;
  }

  public get parent(): DisposableNest | undefined {
    return this.#parent;
  }

  public get hasDisposed(): boolean {
    return this.#hasDisposed;
  }

  dispose() {
    this.#hasDisposed = true;
    this.#parent = undefined;
  }

  spawnChild(name: string) {
    return new DisposableNest(name, this);
  }
}

export class Fetcher<T> implements IDisposable {
  #hasDisposed = false;

  #data?: T;

  constructor(protected url: string) {}

  public get hasDisposed(): boolean {
    return this.#hasDisposed;
  }

  async fetch(): Promise<T> {
    if (this.hasDisposed) {
      throw new Error("Cannot fetch as Fetcher is disposed.");
    }
    if (this.#data) return this.#data;
    return await this.refresh();
  }

  async refresh(): Promise<T> {
    if (this.hasDisposed) {
      throw new Error("Cannot refresh as Fetcher is disposed.");
    }

    const resp = await fetch(this.url);
    const json = await resp.json();

    return json as unknown as T;
  }

  dispose() {
    this.#data = undefined;
    this.#hasDisposed = true;
  }
}

export interface IResult<T> {
  message: string;
  result: T;
}

export interface IProperties<T> {
  properties: T;
}
