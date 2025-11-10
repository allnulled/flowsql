/**
 * 
 * ### `DataProxy.prototype.setMemory(keys:Object):DataProxy`
 * 
 */
module.exports = function(keys) {
  this.constructor.assertion(typeof keys === "object", "Parameter «keys» must be an object on «DataProxy.setMemory»");
  return this;
};