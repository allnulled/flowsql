/**
 * 
 * ### `Flowsql.getSqlType(columnType:String, columnMetadata:Object)`
 * 
 * Método que devuelve el código sql correspondiente a un tipo del `this.$schema[table].columns[columnId].type`.
 * 
 * Este método mapea los tipos de `flowsql` a `sql`.
 * 
 * Solo acepta los tipos:
 * 
 *  - `boolean`: a `INTEGER`
 *  - `real`: a `REAL`
 *  - `integer`: a `BLOB`
 *  - `string`: a `TEXT` o `VARCHAR`
 *  - `blob`: a `BLOB`
 *  - `date`: a `DATE`
 *  - `datetime`: a `DATETIME`
 *  - `object`: a `TEXT`
 *  - `array`: a `TEXT`
 *  - `object-reference`: a `INTEGER`
 *  - `array-reference`: este tipo no se acepta por este método, se procesan por otro lado.
 * 
 */
module.exports = function(columnType, columnMetadata) {
  if(columnType === "string") {
    if(columnMetadata.maxLength) {
      return `VARCHAR(${columnMetadata.maxLength})`;
    } else {
      return `TEXT`;
    }
  }
  if(columnType === "real") {
    return "REAL";
  }
  if(columnType === "blob") {
    return "BLOB";
  }
  if(columnType === "date") {
    return "DATE";
  }
  if(columnType === "datetime") {
    return "DATETIME";
  }
  if(columnType === "object-reference") {
    return `INTEGER REFERENCES ${columnMetadata.referredTable} (id)`;
  }
  if(columnType === "object") {
    return `TEXT`;
  }
  if(columnType === "array") {
    return "TEXT";
  }
  if(columnType === "boolean") {
    return "INTEGER";
  }
  if(columnType === "integer") {
    return "INTEGER";
  }
  throw new Error(`Parameter «columnType=${columnType}» is not identified as type on «getSqlType»`);
};