/**
 * 
 * ### `DataProxy.prototype.memorize(keys:Object):DataProxy`
 * 
 */
module.exports = function(keys) {
  this.constructor.assertion(typeof keys === "object", "Parameter «keys» must be an object on «DataProxy.memorize»");
  return this;
};