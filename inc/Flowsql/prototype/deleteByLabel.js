/**
 * 
 * ### `Flowsql.prototype.deleteByLabel(table:String, label:String):Array`
 * 
 * Método que elimina una fila de una tabla basándose en su columna `label:true`.
 * 
 */
module.exports = function(table, label) {
  this.trace("deleteByLabel");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «deleteByLabel»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «deleteByLabel»`);
  this.assertion(typeof label === "string", `Parameter «label» must be a string on «deleteByLabel»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const labelColumns = columnIds.filter(columnId => allColumns[columnId].label === true);
  this.assertion(labelColumns.length === 1, `Parameter «label» cannot be applied because table «${table}» has not a column as «label» on «deleteByLabel»`);
  const labelColumn = labelColumns[0];
  return this._deleteMany(table, [[labelColumn, "=", label]], "deleteByLabel");
};
