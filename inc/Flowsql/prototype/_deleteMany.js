/**
 * 
 * ### `Flowsql.prototype._deleteMany(table:String, filters:Array, byMethod:String):Array`
 * 
 * Método que elimina múltiples filas a la vez.
 * 
 * Este método interno se usa por `Flowsql.prototype.deleteOne` y `Flowsql.prototype.deleteMany`. De ahí el parámetro `byMethod:String`.
 * 
 * El parámetro `filters:Array` es el mismo que en `Flowsql.prototype._selectMany`, ya que por debajo lo usa.
 * 
 * Devuelve un array con todos los ids eliminados.
 * 
 */
module.exports = function (table, filters, byMethod = "_deleteMany") {
  this.trace("_deleteMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «${byMethod}»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «${byMethod}»`);
  const matchedRows = this._selectMany(table, filters, byMethod);
  const matchedIds = matchedRows.map(row => row.id);
  let sql = "";
  sql += `DELETE FROM ${this.constructor.escapeId(table)}`;
  sql += `\n  WHERE id IN (${matchedIds.join(",")})`;
  sql += ";";
  this.runSql(sql);
  return matchedIds;
};