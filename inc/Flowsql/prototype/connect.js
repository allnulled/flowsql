/**
 * 
 * ### `Flowsql.prototype.connect()`
 * 
 * Método que...
 * 
 */
module.exports = function() {
  this.trace("connect", [...arguments]);
  this.$database = new this.constructor.dependencies.sqlite3(this.$options.filename, this.$options.databaseOptions);
  this._ensureBasicMetadata();
  this._loadSchema();
  return this;
};