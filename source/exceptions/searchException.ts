export default class SearchException extends Error {
  constructor(public readonly key: string, public readonly message: string) {
    super(`${key}.${message}`);
  }
}
