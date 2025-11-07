/**
 * 
 * ### `FlowsqlBrowser.prototype.fetchSql(sql:string)`
 * 
 */
module.exports = async function(sql) {
  const data1 = await this.$database.exec(sql);
  return data1;
};