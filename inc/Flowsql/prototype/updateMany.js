/**
 * 
 * ### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`
 * 
 * Método que actualiza varias filas de golpe.
 * 
 * Por debajo utiliza `Flowsql.prototype._updateMany`.
 * 
 */
module.exports = function(table, filters, values) {
  this.trace("updateMany");
  return this._updateMany(table, filters, values, "updateMany");
};