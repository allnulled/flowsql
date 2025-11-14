/**
 * 
 * ### `Flowsql.prototype.selectOne(table:String, id:String|Number):Object`
 * 
 * Método que selecciona una fila de una tabla basándose en su id.
 * 
 * Por debajo, usa `Flowsql.prototype._selectMany`.
 * 
 */
module.exports = function(table, id) {
  this.trace("selectOne");
  const allMatches = this._selectMany(table, [["id", "=", id]], "selectOne");
  return allMatches[0] || null;
};