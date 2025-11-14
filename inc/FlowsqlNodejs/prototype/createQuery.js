/**
 * 
 * ### `Flowsql.prototype.createQuery(table:String, filters:Array):FlowsqlQuery`
 * 
 * Método que construye una `Query`.
 * 
 * Consulta la interfaz de `Query` para más información.
 * 
 */
module.exports = function(table, filters) {
  return new this.constructor.Query(this, table, filters);
};