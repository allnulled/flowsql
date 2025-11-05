/**
 * 
 * ### `Flowsql.prototype.checkSchemaValidity(schema:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function(schema) {
  const { assertion } = this;
  assertion(typeof schema === "object", `Parameter «schema» must be an object on «checkSchemaValidity»`);
  assertion(typeof schema.tables === "object", `Parameter «schema.tables» must be an object on «checkSchemaValidity»`);
  const tableIds = Object.keys(schema.tables);
  for(let indexTable=0; indexTable<tableIds.length; indexTable++) {
    const tableId = tableIds[indexTable];
    const tableMetadata = schema.tables[tableId];
    assertion(typeof tableMetadata === "object", `Parameter «schema.tables[${tableId}]» must be an object on «checkSchemaValidity»`);
    assertion(typeof tableMetadata.columns === "object", `Parameter «schema.tables[${tableId}].columns» must be an object on «checkSchemaValidity»`);
    const columnIds = Object.keys(tableMetadata.columns);
    for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = tableMetadata.columns[columnId];
      assertion(typeof columnMetadata === "object", `Parameter «schema.tables[${tableId}].columns[${columnId}]» must be an object on «checkSchemaValidity»`);
      assertion(typeof columnMetadata.type === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be an string on «checkSchemaValidity»`);
      assertion(this.constructor.knownTypes.indexOf(columnMetadata.type) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be a known type on «checkSchemaValidity»`);
      const isReference = ["object-reference", "array-reference"].indexOf(columnMetadata.type) !== -1;
      if(isReference) {
        assertion(typeof columnMetadata.referredTable === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].referredTable» must be a string on «checkSchemaValidity»`);
        assertion(columnMetadata.referredTable in this.$schema.tables, `Parameter «schema.tables[${tableId}].columns[${columnId}].referredTable» must be a schema table on «checkSchemaValidity»`);
      }
      assertion(["undefined", "boolean"].indexOf(typeof columnMetadata.unique) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].unique» must be a boolean or undefined on «checkSchemaValidity»`);
      assertion(["undefined", "boolean"].indexOf(typeof columnMetadata.nullable) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].nullable» must be a boolean or undefined on «checkSchemaValidity»`);
      assertion(["undefined", "string"].indexOf(typeof columnMetadata.defaultBySql) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].defaultBySql» must be a string or undefined on «checkSchemaValidity»`);
      assertion(["undefined", "string"].indexOf(typeof columnMetadata.defaultByJs) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].defaultByJs» must be a string or undefined on «checkSchemaValidity»`);
      assertion(["undefined", "number"].indexOf(typeof columnMetadata.maxLength) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].maxLength» must be a number or undefined on «checkSchemaValidity»`);
    }
  }
};