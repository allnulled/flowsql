/**
 * 
 * ### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`
 * 
 * Método que actualiza varias filas de golpe.
 * 
 * Por debajo utiliza `Flowsql.prototype._updateMany`.
 * 
 */
module.exports = function(table, filters, values) {
  this.trace("updateMany");
  this.assertion(typeof table === "string", "Parameter «table» must be a string on «updateMany»");
  this.assertion((typeof filters === "undefined") || Array.isArray(filters), "Parameter «filters» must be an array on «updateMany»");
  this.assertion(typeof values === "object", "Parameter «values» must be an object on «updateMany»");
  return this._updateMany(table, filters, values, "updateMany");
};