export class UnknownUser extends Error {
  constructor() {
    super('Unknown User Type!');
    this.name = this.constructor.name;
  }
}


