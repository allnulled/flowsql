/**
 * 
 * ### `FlowsqlBrowser.prototype.runSql(sql:string)`
 * 
 * En principio hace lo mismo, porque este método no tiene que devolver nada.
 * 
 * Pero se sobreescribe para tener todas las entradas de SQL sobreescritas fácilmente..
 * 
 */
module.exports = async function(sql) {
  this.trace("runSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = await this.$database.exec(sql);
  return data1;
};