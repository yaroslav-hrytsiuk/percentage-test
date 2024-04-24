export class UnknownOperation extends Error {
  constructor() {
    super('Unknown Operation Type!');
    this.name = this.constructor.name;
  }
}