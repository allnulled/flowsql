/**
 * 
 * ### `Flowsql.prototype.createDataProxy(dataset:Array, memory:Object):FlowsqlDataProxy`
 * 
 * Método que construye un `DataProxy`.
 * 
 * Consulta la interfaz de `DataProxy` para más información.
 * 
 */
module.exports = function(dataset, memory) {
  return new this.constructor.DataProxy(dataset, this, memory);
};