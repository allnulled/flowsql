/**
 * 
 * ### `FlowsqlBrowser.prototype.dehydrate():String`
 * 
 * En la versión de node.js este método no existe, porque ya se está trabajando con un fichero `sqlite`.
 * 
 * En la versión de browser de `flowsql`, el `prototype.dehydrate` pasa la base de datos a string.
 * 
 * Esto lo hace llamando a 3 funciones:
 * 
 *  - `SqlDatabase.prototype.export()`
 *  - `String.fromCharCode(...exportedData)`
 *  - `btoa(charcodedData)`
 * 
 */
module.exports = function () {
  const binaryArray = this.$database.export();
  let base64 = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < binaryArray.length; i += chunkSize) {
    const chunk = binaryArray.subarray(i, i + chunkSize);
    base64 += String.fromCharCode(...chunk);
  }
  base64 = btoa(base64);
  return base64;
};