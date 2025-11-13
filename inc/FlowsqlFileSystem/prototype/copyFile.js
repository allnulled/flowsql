/**
 * 
 * ### `FlowsqlFileSystem.prototype.copyFile(sourcePath:String, destinationPath:String)`
 * 
 * Método para copiar un fichero de una ruta origen a una ruta destino.
 * 
 */
module.exports = function(sourcePath, destinationPath) {
  this.assertion(typeof sourcePath === "string", `Parameter «sourcePath» must be a string on «FlowsqlFileSystem.copyFile»`);
  this.assertion(typeof destinationPath === "string", `Parameter «destinationPath» must be a string on «FlowsqlFileSystem.copyFile»`);
  const matched1 = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", sourcePath]
  ]);
  if(matched1.length === 0) {
    throw new Error(`Cannot copy file because source file does not exist on «FlowsqlFileSystem.prototype.copyFile»`);
  } else if(matched1.length !== 1) {
    throw new Error(`Cannot copy file because multiples files share source path. Set 'unique:true' to «node_path» column, arised on «FlowsqlFileSystem.prototype.copyFile»`);
  }
  const matched2 = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", destinationPath]
  ]);
  if(matched2.length !== 0) {
    throw new Error(`Cannot copy file because destination file exists on «FlowsqlFileSystem.prototype.copyFile»`);
  }
  const sourceNode = matched1[0];
  if(sourceNode[this.$options.columnForType] !== "file") {
    throw new Error(`Cannot copy file because source node is not a file on «FlowsqlFileSystem.prototype.copyFile»`);
  }
  const destinationNode = this._copyObject(sourceNode);
  delete destinationNode.id;
  destinationNode[this.$options.columnForPath] = this.constructor.normalizePath(destinationPath);
  destinationNode[this.$options.columnForType] = "file";
  return this.$flowsql.insertOne(this.$table, destinationNode);
};