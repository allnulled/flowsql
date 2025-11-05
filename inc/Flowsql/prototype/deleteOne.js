/**
 * 
 * ### `Flowsql.prototype.deleteOne(table:String, id:String|Number)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, id) {
  this.trace("deleteOne");
  return this._deleteMany(table, [["id", "=", id]], "deleteOne");
};