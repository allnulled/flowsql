/**
 * 
 * ## Query API de Flowsql
 * 
 * ### `FlowsqlQuery.constructor(flowsql, table, filters):FlowsqlQuery`
 * 
 * Método constructor de objetos `Query`.
 * 
 */
module.exports = function(flowsql, table, parameters) {
  this.$flowsql = flowsql;
  this.$table = table;
  this.$parameters = parameters;
  return this;
};