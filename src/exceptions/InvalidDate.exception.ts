export class InvalidDate extends Error {
  constructor() {
    super('Invalid Date!');
    this.name = this.constructor.name;
  }
}