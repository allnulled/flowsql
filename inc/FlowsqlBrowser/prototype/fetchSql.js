/**
 * 
 * ### `FlowsqlBrowser.prototype.fetchSql(sql:string)`
 * 
 * En la versión de browser de `flowsql`, el `prototype.fetch` tiene que compactar los resultados para homogeneizar las salidas.
 * 
 * Para esto llama a `this._compactResults(data1)`.
 * 
 */
module.exports = function(sql) {
  this.trace("fetchSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = this.$database.exec(sql);
  if(Array.isArray(data1)) {
    return this._compactResults(data1);
  }
  return data1;
};