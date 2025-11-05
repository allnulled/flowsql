/**
 * 
 * ### `new Flowsql.AssertionError(message:String)`
 * 
 * Clase que extiende de `Error`. Sirve para especificar errores de tipo aserción.
 * 
 */
module.exports = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};