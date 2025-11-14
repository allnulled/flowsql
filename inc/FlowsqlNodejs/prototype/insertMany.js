/**
 * 
 * ### `Flowsql.prototype.insertMany(table:String, rows:Array):Array<Number>`
 * 
 * Método que inserta múltiples filas de golpe.
 * 
 * Por debajo llamara a `Flowsql.prototype._insertMany`.
 * 
 * Devuelve un array con todos los ítems insertados.
 * 
 */
module.exports = function (table, rows) {
  this.trace("insertMany");
  this.assertion(typeof table === "string", "Parameter «table» must be a string on «insertMany»");
  this.assertion(Array.isArray(rows), "Parameter «rows» must be an array on «insertMany»");
  return this._insertMany(table, rows, "insertMany");
};