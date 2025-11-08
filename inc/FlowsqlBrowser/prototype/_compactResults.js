/**
 * 
 * ### `FlowsqlBrowser.prototype._compactResults(input:Array)`
 * 
 * Método para compactar los resultados de una query tipo `SELECT` en el entorno de navegador.
 * 
 * Este método hace homogénea la salida de `sql.js` en el browser y `better-sqlite3` en node.js.
 * 
 * Pasa de [{column,values}] ===> [{column,value},...]
 * 
 */

module.exports = function (input) {
  this.trace("_compactResults|Browser");
  if (input.length === 0) { return input }
  const results = input[input.length-1];
  const { columns, values } = results;
  const out = values.map(row =>
    columns.reduce((obj, col, i) => {
      obj[col] = row[i];
      return obj;
    }, {})
  );
  return out;
};