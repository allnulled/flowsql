/**
 * 
 * ### `Flowsql.prototype.insertSql(sql:String)`
 * 
 * Método que...
 * 
 */
module.exports = function (sql) {
  if (this.$options.traceSql) {
    console.log("[sql]", sql);
  }
  const result = this.$database.prepare(sql).run();
  return result.lastInsertRowid;
};