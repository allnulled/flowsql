/**
 * 
 * ### `Flowsql.prototype.createFileSystem(table:String, options:Object):FlowsqlFileSystem`
 * 
 * Método que construye un `FileSystem`.
 * 
 * Consulta la interfaz de `FileSystem` para más información.
 * 
 */
module.exports = function(table, options) {
  return new this.constructor.FileSystem(table, this, options);
};