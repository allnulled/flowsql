/**
 * 
 * ### `Flowsql.prototype.deleteMany(table:String, filters:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, filters) {
  this.trace("deleteMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «deleteMany»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «deleteMany»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «deleteMany»`);
  const matchedRows = this.selectMany(table, filters);
  const matchedIds = matchedRows.map(row => row.id);
  // @TOREVIEW: hay que eliminar las rows de las tablas relacionales antes
  let sql = "";
  sql += `DELETE FROM ${this.constructor.escapeId(table)}`;
  sql += `\n  WHERE id IN (${matchedIds.join(",")})`;
  sql += ";";
  this.runSql(sql);
  return matchedIds;
};