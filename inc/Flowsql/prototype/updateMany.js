/**
 * 
 * ### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, filters, values) {
  this.trace("updateMany");
  return this._updateMany(table, filters, values, "updateMany");
};