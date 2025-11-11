/**
 * 
 * ### `FileSystem.prototype.mkdir(filepath:String)`
 * 
 * Método para crear un directorio basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.mkdir»`);
  // @TODO...
};