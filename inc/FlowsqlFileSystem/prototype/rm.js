/**
 * 
 * ### `FileSystem.prototype.rm(directory:String, options:Object)`
 * 
 * Método para eliminar un directorio basándose en una ruta.
 * 
 */
module.exports = function(directory, options = {}) {
  this.assertion(typeof directory === "string", `Parameter «directory» must be a string on «FlowsqlFileSystem.rm»`);
  this.assertion(typeof options === "object", `Parameter «options» must be a object on «FlowsqlFileSystem.rm»`);
  // @TODO...
};