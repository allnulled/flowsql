/**
 * 
 * ### `Flowsql.prototype.createFileSystem(table:String):FlowsqlFileSystem`
 * 
 * Método que construye un `FileSystem`.
 * 
 * Consulta la interfaz de `FileSystem` para más información.
 * 
 */
module.exports = function(dataset, memory) {
  return new this.constructor.FileSystem(dataset, this, memory);
};