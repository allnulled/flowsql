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
  // @TODO...
};