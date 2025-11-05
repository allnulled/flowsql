/**
 * 
 * ### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(table, filters, values) {
  this.trace("updateMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «updateMany»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «updateMany»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «updateMany»`);
  this.assertion(typeof values === "object", `Parameter «values» must be an object on «updateMany»`);
  this._validateInstance(table, values);
  const matchedRows = this.selectMany(table, filters);
  const matchedIds = matchedRows.map(row => row.id);
  // @TOREVIEW: los campos relacionales deben cambiarse aparte
  let sql = "";
  sql += `UPDATE ${this.constructor.escapeId(table)}`;
  sql += `\n  SET ${this._sqlForUpdateSet(table, values)}`;
  sql += `\n  WHERE id IN (${matchedIds.join(",")})`;
  sql += ";";
  this.runSql(sql);
  return matchedIds;
};