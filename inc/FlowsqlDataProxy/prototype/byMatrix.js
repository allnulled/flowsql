/**
 * 
 * ### `DataProxy.prototype.byMatrix(matrix:Array):DataProxy`
 * 
 */
module.exports = function(matrix) {
  this.constructor.Flowsql.assertion(Array.isArray(matrix), "Parameter «matrix» must be an array on «DataProxy.byMatrix»");
  return this;
};