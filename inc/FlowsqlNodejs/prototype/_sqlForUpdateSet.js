/**
 * 
 * ### `Flowsql.prototype._sqlForUpdateSet(table:String, row:Object)`
 * 
 * Método que genera el código `sql` correspondiente a `UPDATE x SET x = y` dada una tabla y una fila.
 * 
 * Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.
 * 
 */
module.exports = function(table, row) {
  this.trace("_sqlForUpdateSet");
  const rowProperties = Object.keys(row);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const relationalColumns = columnIds.filter(columnId => allColumns[columnId].type === "array-reference");
  let sql = "";
  Iterating_row_properties:
  for(let indexProp=0; indexProp<rowProperties.length; indexProp++) {
    const propId = rowProperties[indexProp];
    if(relationalColumns.indexOf(propId) !== -1) {
      continue Iterating_row_properties;
    }
    const propValue = row[propId];
    if(sql !== "") {
      sql += ",";
    }
    sql += `\n    ${this.constructor.escapeId(propId)} = ${this.constructor.escapeValue(propValue)}`;
  }
  return sql;
};