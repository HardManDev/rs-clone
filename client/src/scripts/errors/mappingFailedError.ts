export default class MappingFailedError extends Error {
  constructor(srcName: new () => unknown, targetName: new () => unknown) {
    super(`'${srcName.prototype.constructor.name}' failed to map`
      + `'${targetName.prototype.constructor.name}'`);
  }
}
