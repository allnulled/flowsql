/**
 * 
 * ### `Flowsql.prototype.updateByLabel(table:String, label:String, values:Object)`
 * 
 * Método que actualiza una fila basándose en su columna `label:true`.
 * 
 * 
 * 
 */
module.exports = function(table, label, values) {
  this.trace("updateByLabel");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «updateByLabel»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «updateByLabel»`);
  this.assertion(typeof label === "string", `Parameter «label» must be a string on «updateByLabel»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const labelColumns = columnIds.filter(columnId => allColumns[columnId].label === true);
  this.assertion(labelColumns.length === 1, `Parameter «label» cannot be applied because table «${table}» has not a column as «label» on «updateByLabel»`);
  const labelColumn = labelColumns[0];
  const modifiedIds = this._updateMany(table, [[labelColumn, "=", label]], values, "updateByLabel");
  return modifiedIds[0];
};