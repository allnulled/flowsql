/**
 * 
 * ### `Flowsql.prototype._sqlForInsertValues(table:String, row:Object)`
 * 
 * Método que devuelve el código `sql` correspondiente a ` VALUES (...)` de un `insert` dada una tabla y una fila.
 * 
 * Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.
 * 
 */
module.exports = function (table, row) {
  this.trace("_sqlForInsertValues");
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
    const columnMetadata = allColumns[columnId];
    if(columnMetadata.type === "array") {
      sqlFields += `\n  ${this.constructor.escapeValue(JSON.stringify(row[columnId]))}`;
    } else {
      sqlFields += `\n  ${this.constructor.escapeValue(row[columnId])}`;
    }
  }
  let sql = "";
  sql += ` VALUES (${sqlFields}\n);`;
  return sql;
};