/**
 * 
 * ### `Flowsql.create(...args)`
 * 
 * Método que construye una instancia con `Flowsql.constructor`.
 * 
 * Es un *wrapper* del constructor, para no tener que usar `new`.
 * 
 */
module.exports = function(...args) {
  return new this(...args);
};