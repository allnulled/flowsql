/**
 * 
 * ### `FlowsqlFilesystem.assertion(condition:boolean, errorMessage:String)`
 * 
 * Método que hace una aserción y, de no cumplirse, lanza un mensaje de error.
 * 
 * Es un método utilitario usado por muchas partes de la aplicación.
 * 
 * Lanza errores de tipo `AssertionError`.
 *  
 */
module.exports = function(assertion, errorMessage = "assertion failed") {
  if(!assertion) {
    throw new this.AssertionError(errorMessage);
  }
};