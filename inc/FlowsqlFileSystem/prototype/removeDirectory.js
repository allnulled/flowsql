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
  this.assertion(typeof options === "object", `Parameter «options» must be an object on «FlowsqlFileSystem.removeDirectory»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", this.constructor.normalizePath(dirpath)]
  ]);
  if(matched.length === 0) {
    throw new Error(`Cannot remove directory because no directory was found by «${dirpath}» on «FlowsqlFileSystem.prototype.removeDirectory»`);
  } else if(matched.length !== 1) {
    throw new Error(`Cannot remove directory because multiple nodes with the same path. This error should not happen and it means that your schema is not defining 'unique:true' on the «${this.$options.columnForPath}» column of the «filesystem» table «${this.$table}» arised on «FlowsqlFileSystem.prototype.removeDirectory»`)
  }
  const row = matched[0];
  if(row[this.$options.columnForType] !== "directory") {
    throw new Error(`Cannot remove directory because it is not a directory on «${row[this.$options.columnForPath]}» on «FlowsqlFileSystem.prototype.removeDirectory»`);
  }
  const isRecursive = options.recursive === true;
  if(!isRecursive) {
    return this.$flowsql.deleteOne(this.$table, row.id);
  } else {
    return this.$flowsql.deleteMany(this.$table, [
      [this.$options.columnForPath, "is like", dirpath + "%"]
    ]);
  }
};