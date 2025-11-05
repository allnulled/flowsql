/**
 * 
 * ### `Flowsql.prototype.selectOne(table:String, id:String|Number)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, id) {
  this.trace("selectOne");
  const allMatches = this._selectMany(table, [["id", "=", id]], "selectOne");
  return allMatches[0] || null;
};