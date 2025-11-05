/**
 * 
 * ### `Flowsql.constructor(options:Object)`
 * 
 * Método que...
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