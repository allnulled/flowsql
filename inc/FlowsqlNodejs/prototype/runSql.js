/**
 * 
 * ### `Flowsql.prototype.runSql(sql:String)`
 * 
 * Método que ejecuta un sql, sin devolver nada específico.
 * 
 */
module.exports = function (sql) {
  this.trace("runSql");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  return this.$database.exec(sql);
};