/**
 * 
 * ### `Flowsql.prototype.selectMany(table:String, filters:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function (table, filters = []) {
  this.trace("selectMany");
  return this._selectMany(table, filters, "selectMany");
};