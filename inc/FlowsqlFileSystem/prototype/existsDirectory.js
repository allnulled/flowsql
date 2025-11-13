/**
 * 
 * ### `FlowsqlFileSystem.prototype.existsDirectory(dirpath:String)`
 * 
 * Método para averiguar si existe un nodo basándose en una ruta.
 * 
 */
module.exports = function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.existsDirectory»`);
  // @TODO...
};