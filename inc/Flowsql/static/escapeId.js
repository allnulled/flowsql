/**
 * 
 * ### `Flowsql.escapeId(value:any)`
 * 
 * Método que...
 * 
 */
module.exports = function(value) {
  return "`" + value.replace(/`/g, "") + "`";
};