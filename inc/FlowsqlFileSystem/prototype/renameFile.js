/**
 * 
 * ### `FlowsqlFileSystem.prototype.renameFile(filepath:String)`
 * 
 * Método para cambiar la ruta de un fichero.
 * 
 */
module.exports = function (filepath, newFilepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.renameFile»`);
  this.assertion(typeof newFilepath === "string", `Parameter «newFilepath» must be a string on «FlowsqlFileSystem.prototype.renameFile»`);

  const oldpath = this.constructor.normalizePath(filepath);
  const newpath = this.constructor.normalizePath(newFilepath);

  const matchedOld = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", oldpath]
  ]);

  if (matchedOld.length === 0) {
    throw new Error(`Cannot rename file because no file was found by «${filepath}» on «FlowsqlFileSystem.prototype.renameFile»`);
  } else if (matchedOld.length !== 1) {
    throw new Error(`Cannot rename file because multiple nodes with the same path. This should not happen if «${this.$options.columnForPath}» is unique on «${this.$table}» arised on «FlowsqlFileSystem.prototype.renameFile»`);
  }

  const row = matchedOld[0];
  if (row[this.$options.columnForType] !== "file") {
    throw new Error(`Cannot rename file because the node is not a file on «${oldpath}» on «FlowsqlFileSystem.prototype.renameFile»`);
  }

  const matchedNew = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", newpath]
  ]);

  if (matchedNew.length !== 0) {
    throw new Error(`Cannot rename file to «${newpath}» because another node already exists with that path on «FlowsqlFileSystem.prototype.renameFile»`);
  }

  return this.$flowsql.updateOne(this.$table, row.id, {
    [this.$options.columnForPath]: newpath
  });
};
