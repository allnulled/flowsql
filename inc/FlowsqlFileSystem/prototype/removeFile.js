/**
 * 
 * ### `FlowsqlFileSystem.prototype.removeFile(filepath:String)`
 * 
 * Método para eliminar un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.removeFile»`);
  // @TODO...
};