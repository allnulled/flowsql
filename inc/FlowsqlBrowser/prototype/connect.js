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
module.exports = async function() {
  this.trace("connect", [...arguments]);
  const SQL = await initSqlJs({ file: "db.sqlite" });
  console.log(SQL);
  this.$database = new SQL.Database(this.$options.filename, this.$options.databaseOptions);
  this._ensureBasicMetadata();
  this._loadSchema();
  return this;
};