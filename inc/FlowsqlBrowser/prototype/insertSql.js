/**
 * 
 * ### `FlowsqlBrowser.prototype.insertSql(sql:string)`
 * 
 * En principio hace lo mismo, devuelve los ids insertados.
 * 
 * Este método creo que no está completado todavía, porque hay alguna diferencia con la otra API.
 * 
 */
module.exports = function(sql) {
  this.trace("insertSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = this.$database.exec(sql);
  return data1;
};