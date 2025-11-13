/**
 * 
 * ### `FlowsqlFileSystem.prototype.readFile(filepath:String)`
 * 
 * Método para leer un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.readFile»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", this.constructor.normalizePath(filepath)]
  ]);
  if(matched.length === 1) {
    return matched[0][this.$options.columnForContent];
  }
  return undefined;
};