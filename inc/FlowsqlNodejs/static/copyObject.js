/**
 * 
 * ### `Flowsql.copyObject(obj:Object)`
 * 
 * Método que copia un objeto JSON y lo devuelve.
 * 
 * Utiliza `JSON.parse(JSON.stringify(obj))`.
 * 
 */
module.exports = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};