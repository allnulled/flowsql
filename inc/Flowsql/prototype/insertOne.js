/**
 * 
 * ### `Flowsql.prototype.insertOne(table:String, item:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, item) {
  this.trace("insertOne");
  const insertedIds = this.insertMany(table, [item]);
  return insertedIds[0];
};