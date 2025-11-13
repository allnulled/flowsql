/**
 * 
 * ### `FileSystem.prototype.writeDirectory(dirpath:String)`
 * 
 * Método para crear un directorio basándose en una ruta.
 * 
 */
module.exports = function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.writeDirectory»`);
  // @TODO...
};