/**
 * 
 * ### `FileSystem.prototype.readdir(directory:String)`
 * 
 * Método para leer un directorio basándose en una ruta.
 * 
 */
module.exports = function(directory) {
  this.assertion(typeof directory === "string", `Parameter «directory» must be a string on «FlowsqlFileSystem.readdir»`);
  // @TODO...
};