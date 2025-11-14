/**
 * 
 * ## Client API de Flowsql
 * 
 * ### `FlowsqlClient.constructor(options:Object):FlowsqlClient`
 * 
 * Método constructor de objetos `Client`. Sirven para lanzar queries al objeto `Server` vía net.
 * 
 */
module.exports = function(options) {
  this.$flowsql = flowsql;
  this.$options = options;
  return this;
};