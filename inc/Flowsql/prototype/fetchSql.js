/**
 * 
 * ### `Flowsql.prototype.fetchSql(sql:String)`
 * 
 * Método que...
 * 
 */
module.exports = function (sql) {
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  return this.$database.prepare(sql).all();
};