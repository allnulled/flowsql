/**
 * 
 * ### `FlowsqlFileSystem.prototype.readDirectory(dirpath:String)`
 * 
 * Método para leer un directorio basándose en una ruta.
 * 
 */
module.exports = function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.readDirectory»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "is like", this.constructor.normalizePath(dirpath, "%")]
  ]);
  const immediateMatched = matched.filter(row => {
    const nodePath = row[this.$options.columnForPath];
    const dirSubpath = (dirpath + "/").replace(/\/\/+/g, "/");
    const isDirSubpath = nodePath.startsWith(dirSubpath);
    if(!isDirSubpath) {
      return false;
    }
    const slashMatches = nodePath.replace(dirSubpath, "").match(/\//g);
    const isImmediateChild = slashMatches === null;
    return isImmediateChild;
  });
  return immediateMatched;
};