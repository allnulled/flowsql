/**
 * 
 * ### `FlowsqlFileSystem.prototype.readFile(filepath:String)`
 * 
 * Método para leer un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.readFile»`);
  // @TODO...
};