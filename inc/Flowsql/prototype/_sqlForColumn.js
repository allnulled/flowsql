/**
 * 
 * ### `Flowsql.prototype._sqlForColumn(columnId:String, columnMetadata:Object)`
 * 
 * Método que devuelve el código `sql` que describe la columna especificada.
 * 
 * Consultará los valores:
 * 
 * - `columnMetadata.type`
 * - `columnMetadata.unique`
 * - `columnMetadata.nullable`
 * - `columnMetadata.defaultBySql`
 * 
 */
module.exports = function (columnId, columnMetadata) {
  const columnType = columnMetadata.type;
  if (columnType === "array-reference") {
    return {
      relational:columnId
    };
  }
  const sqlType = this.constructor.getSqlType(columnType, columnMetadata);
  let sql = "";
  sql += `${this.constructor.escapeId(columnId)} ${sqlType}`;
  if (columnMetadata.unique) {
    sql += ` UNIQUE`;
  }
  if (columnMetadata.nullable !== true) {
    sql += ` NOT NULL`;
  }
  if (columnMetadata.defaultBySql) {
    sql += ` DEFAULT ${columnMetadata.defaultBySql}`;
  }
  return sql;
}