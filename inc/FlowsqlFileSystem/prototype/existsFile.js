/**
 * 
 * ### `FlowsqlFileSystem.prototype.existsFile(filepath:String)`
 * 
 * Método para averiguar si existe un nodo y es un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.existsFile»`);
  // @TODO...
};