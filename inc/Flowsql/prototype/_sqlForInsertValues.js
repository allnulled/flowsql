/**
 * 
 * ### `Flowsql.prototype._sqlForInsertValues(table:String, row:Object)`
 * 
 * Método que devuelve el código `sql` correspondiente a ` VALUES (...)` de un `insert` dada una tabla y una fila.
 * 
 * Consultará y omitirá las columnas relacionales en el `this.$schema`.
 * 
 */
module.exports = function (table, row) {
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const nonRelationalColumns = columnIds.filter(columnId => allColumns[columnId].type !== "array-reference");
  let sqlFields = "";
  Iterating_non_relational_columns:
  for(let indexColumns=0; indexColumns<nonRelationalColumns.length; indexColumns++) {
    const columnId = nonRelationalColumns[indexColumns];
    if(!(columnId in row)) {
      continue Iterating_non_relational_columns;
    }
    if(sqlFields.length) {
      sqlFields += ",";
    }
    sqlFields += `\n  ${this.constructor.escapeValue(row[columnId])}`;
  }
  let sql = "";
  sql += ` VALUES (${sqlFields}\n);`;
  return sql;
};