/**
 * 
 * ### `Flowsql.prototype.runSql(sql:String)`
 * 
 * Método que...
 * 
 */
module.exports = function (sql) {
  if (this.$options.traceSql) {
    console.log("[sql]", sql);
  }
  return this.$database.exec(sql);
};