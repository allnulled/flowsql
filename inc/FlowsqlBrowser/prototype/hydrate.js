/**
 * 
 * ### `FlowsqlBrowser.prototype.hydrate(base64:String):String`
 * 
 * En la versión de node.js este método no existe, porque ya se está trabajando con un fichero `sqlite`.
 * 
 * En la versión de browser de `flowsql`, el `prototype.hydrate` cambia la instancia de la base de datos según la base de datos resultante del string en base64 proporcionado.
 * 
 * Esto lo hace llamando a 3 funciones:
 * 
 *  - `Uint8Array.from(...)`
 *  - `atob(base64)`
 *  - `new SQL.Database(binaryData)`
 * 
 */
module.exports = async function (base64) {
  const binary = Uint8Array.from(
    atob(base64),
    c => c.charCodeAt(0)
  );
  const db = new GlobalSqlite.Database(binary);
  this.$database = db;
  this._loadSchema();
};