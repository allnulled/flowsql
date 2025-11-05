/**
 * 
 * ### `Flowsql.assertion(condition:boolean, errorMessage:String)`
 * 
 * Método que...
 * 
 */
module.exports = function(assertion, errorMessage = "assertion failed") {
  if(!assertion) {
    throw new this.AssertionError(errorMessage);
  }
};