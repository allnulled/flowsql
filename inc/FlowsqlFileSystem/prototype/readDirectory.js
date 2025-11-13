/**
 * 
 * ### `FlowsqlFileSystem.prototype.readDirectory(dirpath:String)`
 * 
 * Método para leer un directorio basándose en una ruta.
 * 
 */
module.exports = function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.readDirectory»`);
  // @TODO...
};