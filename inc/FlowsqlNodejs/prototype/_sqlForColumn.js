/**
 * 
 * ### `Flowsql.prototype._sqlForColumn(columnId:String, columnMetadata:Object)`
 * 
 * Método que devuelve el código `sql` que describe la columna especificada.
 * 
 * Consultará los valores:
 * 
 * - `columnMetadata.type` que debe ser uno de los `Flowsql.knownTypes` donde se incluyen:
 *    - `"boolean"`
 *    - `"integer"`
 *    - `"real"`
 *    - `"string"`
 *    - `"blob"`
 *    - `"date"`
 *    - `"datetime"`
 *    - `"object"`
 *    - `"array"`
 *    - `"object-reference"`
 *    - `"array-reference"`
 * - `columnMetadata.unique` que por defecto sería `false`.
 * - `columnMetadata.nullable` que por defecto sería `false`, es decir, por defecto todas las columnas son `NOT NULL`.
 * - `columnMetadata.defaultBySql` que no tiene un valor por defecto.
 * 
 */
module.exports = function (columnId, columnMetadata) {
  this.trace("_sqlForColumn");
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