/**
 * 
 * ### `FlowsqlFileSystem.prototype.exists(filepath:String)`
 * 
 * Método para averiguar si existe un nodo basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.exists»`);
  const node = this.findByPath(filepath);
  return node !== null;
};