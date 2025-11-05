/**
 * 
 * ### `Flowsql.prototype.insertOne(table:String, item:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, item) {
  this.trace("insertOne");
  const insertedIds = this._insertMany(table, [item], "insertOne");
  return insertedIds[0];
};