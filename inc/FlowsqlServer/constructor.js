/**
 * 
 * ## Server API de Flowsql
 * 
 * ### `FlowsqlServer.constructor(flowsql:Object, options:Object):FlowsqlServer`
 * 
 * Método constructor de objetos `Server`.
 * 
 */
module.exports = function(flowsql, options) {
  this.$flowsql = flowsql;
  this.$options = options;
  return this;
};