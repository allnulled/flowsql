/**
 * 
 * ### `Flowsql.prototype.deleteMany(table:String, filters:Array):Array`
 * 
 * Método que elimina varias filas de golpe.
 * 
 * Este método llama a `Flowsql.prototype._deleteMany` por debajo.
 * 
 * Devuelve los ids de las filas eliminadas.
 * 
 */
module.exports = function(table, filters) {
  this.trace("deleteMany");
  return this._deleteMany(table, filters, "deleteMany");
};