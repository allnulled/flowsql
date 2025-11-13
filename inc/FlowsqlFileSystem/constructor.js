/**
 * 
 * ## FileSystem API de Flowsql
 * 
 * La `FileSystem API de Flowsql` permite crear una interfaz programática para interactuar con un sistema de ficheros basándose en una tabla de la base de datos.
 * 
 * La tabla debe cumplir con unos requisitos en el `$schema`.
 * 
 * ### `new FlowsqlFileSystem(database:Flowsql, table:String, options:Object): FlowsqlFileSystem`
 * 
 * Método constructor.
 * 
 */
module.exports = function(table, flowsql, options = {}) {
  this.constructor.assertion(typeof table === "string", `Parameter «table» must be a string on «FlowsqlFileSystem.constructor»`);
  this.constructor.assertion(typeof flowsql === "object", `Parameter «flowsql» must be a object on «FlowsqlFileSystem.constructor»`);
  this.constructor.assertion(typeof options === "object", `Parameter «options» must be a object on «FlowsqlFileSystem.constructor»`);
  this.constructor.assertion(table in flowsql.$schema.tables, `Parameter «table» must be a table in the schema on «FlowsqlFileSystem.constructor»`);
  this.$table = table;
  this.$flowsql = flowsql;
  this.$options = Object.assign({}, this.constructor.defaultOptions, options);
  return this;
};