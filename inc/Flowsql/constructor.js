/**
 * 
 * ## `Node.js API de Flowsql`
 * 
 * La `Node.js API de Flowsql` es la API que se carga en entorno de node.js.
 * 
 * Aquí se explican los métodos que esta API tiene, y que son la base para la `Browser API de Flowsql` también.
 * 
 * ### `Flowsql.constructor(options:Object)`
 * 
 * Método que construye una instancia `Flowsql`.
 * 
 * El parámetro `options:Object` sobreescribirá las `this.constructor.defaultOptions`.
 * 
 * El parámetro `options.databaseOptions:Object` sobreescribirá las `this.constructor.defaultDatabaseOptions`.
 * 
 * Luego, además, llama a `this.connect()` directamente. Es decir que en el momento de crear la instancia, ya se abre la conexión sqlite.
 * 
 */
module.exports = function(options = {}) {
  this.$database = null;
  this.$schema = { tables: {} };
  this.$options = Object.assign({}, this.constructor.defaultOptions, options);
  this.$options.databaseOptions = Object.assign({}, this.constructor.defaultDatabaseOptions, options.databaseOptions || {});
  console.log("[*] Connecting to Flowsql database from file: " + this.$options.filename);
  this.connect();
  return this;
};