/**
 * 
 * ### `FileSystem.prototype.copyFile(oathSource:String, pathDestination:String)`
 * 
 * Método para copiar un fichero de una ruta origen a una ruta destino.
 * 
 */
module.exports = function(pathSource, pathDestination) {
  this.assertion(typeof pathSource === "string", `Parameter «pathSource» must be a string on «FlowsqlFileSystem.copyFile»`);
  this.assertion(typeof pathDestination === "string", `Parameter «pathDestination» must be a string on «FlowsqlFileSystem.copyFile»`);
  // @TODO...
};