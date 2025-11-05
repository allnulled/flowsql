/**
 * 
 * ### `Flowsql.prototype._sqlForInsertInto(table:String, row:Object)`
 * 
 * Método que devuelve el código `sql` correspondiente a `INSERT INTO (...)` dada una tabla y una fila.
 * 
 * Se consultarán y omitirán las columnas relacionales en el `this.$schema.tables[table]`.
 * 
 */
module.exports = function (table, row) {
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const nonRelationalColumns = columnIds.filter(columnId => allColumns[columnId].type !== "array-reference");
  let sqlFields = "";
  Iterating_non_relational_columns:
  for(let indexColumn=0; indexColumn<nonRelationalColumns.length; indexColumn++) {
    const columnId = nonRelationalColumns[indexColumn];
    if(!(columnId in row)) {
      continue Iterating_non_relational_columns;
    }
    if(sqlFields.length !== 0) {
      sqlFields += `,`;
    }
    sqlFields += `\n  ${this.constructor.escapeId(columnId)}`;
  }
  let sql = "";
  sql += `INSERT INTO ${this.constructor.escapeId(table)} (${sqlFields}\n)`;
  return sql;
};