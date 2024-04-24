export class NegativeNumber extends Error {
  constructor() {
    super('Amount can\'t be negative number!');
    this.name = this.constructor.name;
  }
}