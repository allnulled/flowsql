/**
 * 
 * ### `FlowsqlBrowser.prototype.connect()`
 * 
 * Método que crea una instancia de `sqlite3` y actualiza el esquema.
 * 
 * Este método utiliza los siguientes parámetros:
 * 
 * - `this.$options.filename:String` como ruta al fichero `*.sqlite`
 * - `this.$options.databaseOptions:Object` como parámetros para la instancia `sqlite3`
 * 
 * Luego, además, asegura que existen los metadatos básicos en la base de datos con `Flowsql.prototype._ensureBasicMetadata()`.
 * 
 * Luego, además, recarga el esquema propio con el existente en la base de datos, con `Flowsql.prototype._loadSchema()`.
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