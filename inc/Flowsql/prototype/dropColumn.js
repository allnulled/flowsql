/**
 * 
 * ### `Flowsql.prototype.dropColumn(table:String, columnId:String)`
 * 
 * Método que...
 * 
 */
module.exports = function (table, columnId) {
  this.trace("dropColumn", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «dropColumn»`);
  this.assertion(typeof columnId === "string", `Parameter «columnId» must be a string on «dropColumn»`);
  this.assertion(typeof this.$schema.tables[table] === "object", `Parameter «table» must be a schema table on «dropColumn»`);
  this.assertion(typeof this.$schema.tables[table].columns[columnId] === "object", `Parameter «columnId» must be a schema column on «dropColumn»`);
  const isRelationalColumn = this.$schema.tables[table].columns[columnId].type === "array-reference";
  if(isRelationalColumn) {
    const relationalTable = `Rel_x_${table}_x_${columnId}`;
    this.runSql(`DROP TABLE ${this.constructor.escapeId(relationalTable)};`);
  } else {
    this.runSql(`ALTER TABLE ${this.constructor.escapeId(table)} DROP COLUMN ${this.constructor.escapeId(columnId)};`);
  }
  delete this.$schema.tables[table].columns[columnId];
  this._persistSchema();
};