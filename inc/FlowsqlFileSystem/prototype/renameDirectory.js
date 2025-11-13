/**
 * 
 * ### `FlowsqlFileSystem.prototype.renameDirectory(dirpath:String)`
 * 
 * Método para cambiar la ruta de un directorio.
 * 
 */
module.exports = function(dirpath, newDirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.prototype.renameDirectory»`);
  this.assertion(typeof newDirpath === "string", `Parameter «newDirpath» must be a string on «FlowsqlFileSystem.prototype.renameDirectory»`);

  const oldpath = this.constructor.normalizePath(dirpath);
  const newpath = this.constructor.normalizePath(newDirpath);

  const matchedOld = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", oldpath]
  ]);

  if(matchedOld.length === 0) {
    throw new Error(`Cannot rename directory because no directory was found by «${dirpath}» on «FlowsqlFileSystem.prototype.renameDirectory»`);
  } else if(matchedOld.length !== 1) {
    throw new Error(`Cannot rename directory because multiple nodes with the same path. This should not happen if «${this.$options.columnForPath}» is unique on «${this.$table}» arised on «FlowsqlFileSystem.prototype.renameDirectory»`);
  }

  const rowDir = matchedOld[0];
  if(rowDir[this.$options.columnForType] !== "directory") {
    throw new Error(`Cannot rename directory because the node is not a directory on «${oldpath}» on «FlowsqlFileSystem.prototype.renameDirectory»`);
  }

  const matchedNew = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", newpath]
  ]);
  if(matchedNew.length !== 0) {
    throw new Error(`Cannot rename directory to «${newpath}» because another node already exists with that path on «FlowsqlFileSystem.prototype.renameDirectory»`);
  }

  const allChildren = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "is like", oldpath + "/%"]
  ]);

  for(let i=0; i<allChildren.length; i++) {
    const row = allChildren[i];
    const oldChildPath = row[this.$options.columnForPath];

    if(!oldChildPath.startsWith(oldpath + "/")) {
      continue;
    }

    const rest = oldChildPath.substring((oldpath + "/").length);
    const newChildPath = this.constructor.normalizePath(newpath, rest);

    const matchedChildNew = this.$flowsql.selectMany(this.$table, [
      [this.$options.columnForPath, "=", newChildPath]
    ]);
    if(matchedChildNew.length !== 0) {
      throw new Error(`Cannot rename directory because a child rename conflict «${newChildPath}» already exists on «FlowsqlFileSystem.prototype.renameDirectory»`);
    }

    this.$flowsql.updateOne(this.$table, row.id, {
      [this.$options.columnForPath]: newChildPath
    });
  }

  return this.$flowsql.updateOne(this.$table, rowDir.id, {
    [this.$options.columnForPath]: newpath
  });
};
