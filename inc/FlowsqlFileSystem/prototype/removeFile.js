/**
 * 
 * ### `FlowsqlFileSystem.prototype.removeFile(filepath:String)`
 * 
 * Método para eliminar un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.removeFile»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", this.constructor.normalizePath(filepath)]
  ]);
  if(matched.length === 0) {
    throw new Error(`Cannot remove file because no file was found by «${filepath}» on «FlowsqlFileSystem.prototype.removeFile»`);
  } else if(matched.length !== 1) {
    throw new Error(`Cannot remove file because multiple files with the same path. This error should not happen and it means that your schema is not defining 'unique:true' on the «${this.$options.columnForPath}» column of the «filesystem» table «${this.$table}» arised on «FlowsqlFileSystem.prototype.removeFile»`)
  }
  const row = matched[0];
  if(row[this.$options.columnForType] !== "file") {
    throw new Error(`Cannot remove file because the node is not a file on «${row[this.$options.columnForPath]}» on «FlowsqlFileSystem.prototype.removeFile»`);
  }
  return this.$flowsql.deleteOne(this.$table, row.id);
};