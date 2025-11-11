/**
 * 
 * ### `FileSystem.prototype.lstat(nodepath:String)`
 * 
 * Método para eliminar un directorio basándose en una ruta.
 * 
 */
module.exports = function(nodepath) {
  this.assertion(typeof nodepath === "string", `Parameter «nodepath» must be a string on «FlowsqlFileSystem.rm»`);
  // @TODO...
};