/**
 * 
 * ### `FlowsqlBrowser.prototype.connect()`
 * 
 * Método que llama, en entorno browser, a `SQL = await initSqlJs({ locateFile: file => "sql-wasm.wasm" })`.
 * 
 * Después, llama a `this.$database = new SQL.Database(this.$options.databaseOptions)`.
 * 
 * Después hace el `_ensureBasicMetadata()` igual que en la versión de node.js.
 
 * Después hace el `_loadSchema()` igual que en la versión de node.js.
 * 
 */
module.exports = async function () {
  this.trace("connect|Browser");
  const SQL = await initSqlJs({
    locateFile: file => `sql-wasm.wasm`
  });
  this.$database = new SQL.Database(this.$options.databaseOptions);
  await this._ensureBasicMetadata();
  await this._loadSchema();
  return this;
};