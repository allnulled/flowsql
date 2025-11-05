/**
 * 
 * ### `Flowsql.escapeValue(value:any)`
 * 
 * Método que escapa valores en la sintaxis sql.
 * 
 */
module.exports = function(value) {
  if(typeof value === "string") {
    return "'" + value.replace(/'/g, "''") + "'";
  }
  return value;
};