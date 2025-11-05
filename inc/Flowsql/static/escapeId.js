/**
 * 
 * ### `Flowsql.escapeId(value:any)`
 * 
 * Método que sirve para escapar identificadores en la sintaxis sql.
 * 
 */
module.exports = function(value) {
  return "`" + value.replace(/`/g, "") + "`";
};