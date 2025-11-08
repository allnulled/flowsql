/**
 * 
 * ### `FlowsqlBrowser.prototype.insertSql(sql:string)`
 * 
 * En principio es lo mismo.
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