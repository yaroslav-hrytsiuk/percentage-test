export class WrongPath extends Error {
  constructor() {
    super('No such file or directory!');
    this.name = this.constructor.name;
  }
}