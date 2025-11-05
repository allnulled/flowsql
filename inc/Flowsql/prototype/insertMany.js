/**
 * 
 * ### `Flowsql.prototype.insertMany(table:String, rows:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function (table, rows) {
  this.trace("insertMany");
  return this._insertMany(table, rows, "insertMany");
};