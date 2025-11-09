/**
 * 
 * ## `Browser API de Flowsql`
 * 
 * La `Browser API de Flowsql` es la API que se carga en entorno de navegador.
 * 
 * Aquí se explican los métodos que esta API sobreescribe de la `API de Node.js de Flowsql`.
 * 
 * ### `FlowsqlBrowser.constructor(options:Object)`
 * 
 * Método que construye una instancia `FlowsqlBrowser`.
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
  console.log("[*] Connecting to FlowsqlBrowser database from file: " + this.$options.filename);
  return this;
};