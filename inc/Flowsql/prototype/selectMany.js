/**
 * 
 * ### `Flowsql.prototype.selectMany(table:String, filters:Array):Array`
 * 
 * Método que selecciona múltiples filas de una tabla.
 * 
 * Por debajo, usa `Flowsql.prototype._selectMany`.
 * 
 */
module.exports = function (table, filters = []) {
  this.trace("selectMany");
  return this._selectMany(table, filters, "selectMany");
};