/**
 * 
 * #### `new Flowsql.DataProxy(dataset:Array, database:Flowsql|FlowsqlBrowser)`
 * 
 * Método para crear un data proxy de flowsql. 
 * 
 * Los data proxy permiten iterar sobre un conjunto de datos mediante method chaining o procesar matrices de operaciones, entre otras.
 * 
 * Los data proxy pueden necesitar acceso a la base de datos, por lo cual se pide como segundo parámetro `database:Flowsql|FlowsqlBrowser`.
 * 
 */
module.exports = function(dataset, database, memory = {}) {
  this.constructor.Flowsql.assertion(Array.isArray(dataset), "Parameter «dataset» must be an array on «DataProxy»");
  this.constructor.Flowsql.assertion(typeof database === "object", "Parameter «database» must be an object on «DataProxy»");
  this.constructor.Flowsql.assertion(database instanceof this.constructor.Flowsql, "Parameter «database» must be a child of «DataProxy.Flowsql» on «DataProxy»");
  this.constructor.Flowsql.assertion(typeof memory === "object", "Parameter «memory» must be an object on «DataProxy»");
  this.$database = database;
  this.$dataset = dataset;
  this.$memory = memory;
  return this;
};