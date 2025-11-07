/**
 * 
 * ### `FlowsqlBrowser.prototype.runSql(sql:string)`
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