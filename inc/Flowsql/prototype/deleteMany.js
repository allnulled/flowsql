/**
 * 
 * ### `Flowsql.prototype.deleteMany(table:String, filters:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, filters) {
  this.trace("deleteMany");
  return this._deleteMany(table, filters, "deleteMany");
};