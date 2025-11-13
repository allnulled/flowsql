/**
 * 
 * ### `FlowsqlFilesystem.prototype.assertion(condition:boolean, errorMessage:String)`
 * 
 * Lo mismo que la versión estática, pero para encontrarla antes.
 *  
 */
module.exports = function(assertion, errorMessage = "assertion failed") {
  if(!assertion) {
    throw new this.constructor.AssertionError(errorMessage);
  }
};