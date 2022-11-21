export class NeverError extends Error {
  constructor(value: never) {
    super("This value should never be reached: " + value);
  }
}