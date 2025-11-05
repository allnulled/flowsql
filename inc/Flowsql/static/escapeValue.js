/**
 * 
 * ### `Flowsql.escapeValue(value:any)`
 * 
 * Método que...
 * 
 */
module.exports = function(value) {
  if(typeof value === "string") {
    return "'" + value.replace(/'/g, "''") + "'";
  }
  return value;
};