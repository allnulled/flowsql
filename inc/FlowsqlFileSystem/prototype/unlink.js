/**
 * 
 * ### `FileSystem.prototype.rm(filepath:String, options:Object)`
 * 
 * Método para eliminar un directorio basándose en una ruta.
 * 
 */
module.exports = function(filepath, options = {}) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.rm»`);
  this.assertion(typeof options === "object", `Parameter «options» must be a object on «FlowsqlFileSystem.rm»`);
  // @TODO...
};