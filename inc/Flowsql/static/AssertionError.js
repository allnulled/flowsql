/**
 * 
 * ### `new Flowsql.AssertionError(message:String)`
 * 
 * Método que...
 * 
 */
module.exports = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};