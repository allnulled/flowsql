/**
 * 
 * ### `Flowsql.prototype.selectByTags(table:String, label:String)`
 * 
 * Este método permite seleccionar una fila de una tabla basándose en la columna que tiene `label: true` en el esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `label:String` será el valor que tiene que tener la fila en la columna en la cual, en el esquema, tenga la propiedad `label` en `true`.
 * 
 */
module.exports = function(table, tags) {
  this.trace("selectByTags");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «selectByTags»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «selectByTags»`);
  this.assertion(Array.isArray(tags), `Parameter «tags» must be an array on «selectByTags»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const tagColumns = columnIds.filter(columnId => allColumns[columnId].tag === true);
  this.assertion(tagColumns.length !== 0, `Parameter «tag» cannot be applied because table «${table}» has not any column as «tag» on «selectByTags»`);
  let allMatches = [];
  for(let indexTag=0; indexTag<tagColumns.length; indexTag++) {
    const tagColumn = tagColumns[indexTag];
    const matchedRows = this._selectMany(table, [[tagColumn, "has", tags]], "selectByTags");
    allMatches = allMatches.concat(matchedRows);
  }
  return allMatches || null;
};