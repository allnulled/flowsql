/**
 * 
 * ### `FileSystem.prototype.writeFile(filepath:String, content:String)`
 * 
 * Método para escribir en un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath, content) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.writeFile»`);
  this.assertion(typeof content === "string", `Parameter «content» must be a string on «FlowsqlFileSystem.writeFile»`);
  // @TODO...
};