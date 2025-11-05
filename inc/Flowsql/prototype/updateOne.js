/**
 * 
 * ### `Flowsql.prototype.updateOne(table:String, id:String|Number, values:Object)`
 * 
 * Método que actualiza una fila basándose en su id.
 * 
 * Por debajo utiliza `Flowsql.prototype._updateMany`.
 * 
 */
module.exports = function(table, id, values) {
  this.trace("updateOne");
  const modifiedIds = this._updateMany(table, [["id", "=", id]], values, "updateOne");
  return modifiedIds[0];
};