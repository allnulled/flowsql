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
module.exports = function(database, table, options = {}) {
  this.$database = database;
  this.$table = table;
  this.$options = Object.assign({}, this.constructor.defaultOptions, options);
};