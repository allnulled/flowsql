/**
 * 
 * ### `Flowsql.prototype.selectByLabel(table:String, label:String)`
 * 
 * Este método permite seleccionar una fila de una tabla basándose en la columna que tiene `label: true` en el esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `label:String` será el valor que tiene que tener la fila en la columna en la cual, en el esquema, tenga la propiedad `label` en `true`.
 * 
 */
module.exports = function(table, label) {
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «selectByLabel»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «selectByLabel»`);
  this.assertion(typeof label === "string", `Parameter «label» must be a string on «selectByLabel»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const labelColumns = columnIds.filter(columnId => allColumns[columnId].label === true);
  this.assertion(labelColumns.length === 1, `Parameter «label» cannot be applied because table «${table}» has not a column as «label» on «selectByLabel»`);
  const labelColumn = labelColumns[0];
  const matchedRows = this._selectMany(table, [[labelColumn, "=", label]]);
  return matchedRows[0] || null;
};