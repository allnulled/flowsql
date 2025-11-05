/**
 * 
 * ### `Flowsql.copyObject(obj:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};