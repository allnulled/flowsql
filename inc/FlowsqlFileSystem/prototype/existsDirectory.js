/**
 * 
 * ### `FlowsqlFileSystem.prototype.existsDirectory(dirpath:String)`
 * 
 * Método para averiguar si existe un nodo basándose en una ruta.
 * 
 */
module.exports = function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.existsDirectory»`);
  const node = this.findByPath(filepath);
  if(node === null) {
    return false;
  }
  if(node[this.$options.columnForType] !== "directory") {
    return false;
  }
  return true;
};