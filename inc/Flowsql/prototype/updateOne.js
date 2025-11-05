/**
 * 
 * ### `Flowsql.prototype.updateOne(table:String, id:String|Number, values:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, id, values) {
  this.trace("updateOne");
  return this.updateMany(table, [["id", "=", id]], values);
};