/**
 * 
 * ### `Flowsql.getSqlType(columnType:String, columnMetadata:Object)`
 * 
 * Método que...
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