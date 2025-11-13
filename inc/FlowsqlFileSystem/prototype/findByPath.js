/**
 * 
 * ### `FlowsqlFileSystem.prototype.findByPath(filepath:String):Object`
 *  
 * Método que encuentra un nodo según su ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «findByPath»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", filepath]
  ]);
  return matched[0] || null;
}