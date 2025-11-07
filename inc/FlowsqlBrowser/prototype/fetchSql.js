/**
 * 
 * ### `FlowsqlBrowser.prototype.fetchSql(sql:string)`
 * 
 */
module.exports = async function(sql) {
  this.trace("fetchSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = await this.$database.exec(sql);
  return data1;
};