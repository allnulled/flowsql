/**
 * 
 * ### `Flowsql.prototype.insertSql(sql:String):Number`
 * 
 * Método que ejecuta un `INSERT` en sql y devuelve el último id insertado.
 * 
 */
module.exports = function (sql) {
  this.trace("insertSql");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const result = this.$database.prepare(sql).run();
  return result.lastInsertRowid;
};