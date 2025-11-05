/**
 * 
 * ### `Flowsql.prototype.fetchSql(sql:String):Array`
 * 
 * Método que ejecuta una sentencia sql de tipo `SELECT` y devuelve los registros.
 * 
 * Si `this.$options.traceSql` está en `true` imprimirá el código sql a ejecutar.
 * 
 * Devuelve un array con todos los elementos coincidentes.
 * 
 */
module.exports = function (sql) {
  this.trace("fetchSql");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  return this.$database.prepare(sql).all();
};