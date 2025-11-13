/**
 * 
 * ### `FlowsqlFileSystem.prototype.removeDirectory(directory:String, options:Object)`
 * 
 * Método para eliminar un directorio basándose en una ruta.
 * 
 * Puede usarse, en `options:Object`, el flag `recursive:true` para eliminar recursivamente.
 * 
 */
module.exports = function(dirpath, options = {}) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.removeDirectory»`);
  this.assertion(typeof options === "object", `Parameter «options» must be a object on «FlowsqlFileSystem.removeDirectory»`);
  // @TODO...
};