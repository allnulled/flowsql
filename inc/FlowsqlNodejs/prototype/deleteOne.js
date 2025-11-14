/**
 * 
 * ### `Flowsql.prototype.deleteOne(table:String, id:String|Number):Number`
 * 
 * Método que elimina 1 fila basándose en su campo `id`.
 * 
 * Este método llama a `Flowsql.prototype._deleteMany` por debajo.
 * 
 * Devuelve el id de la fila eliminada.
 * 
 */
module.exports = function(table, id) {
  this.trace("deleteOne");
  return this._deleteMany(table, [["id", "=", id]], "deleteOne");
};