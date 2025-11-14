/**
 * 
 * ### `Flowsql.prototype.addTable(table:String, partialSchema:Object)`
 * 
 * Método que añade una nueva tabla al esquema sql.
 * 
 * El parámetro `table:String` debe existir en el esquema.
 * 
 * El parámetro `partialSchema:Object` debe cumplir con las validaciones correspondientes a un esquema parcial de tabla.
 * 
 * Además de crear la tabla principal, se crearán las tablas relacionales correspondientes a las columnas relacionales especificadas en `partialSchema:Object`.
 * 
 */
module.exports = function(table, partialSchema) {
  this.trace("addTable", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «addTable»`);
  this.assertion(typeof partialSchema === "object", `Parameter «partialSchema» must be an object on «addTable»`);
  this.assertion(typeof partialSchema.columns === "object", `Parameter «partialSchema.columns» must be an object on «addTable»`);
  this.assertion(!(table in this.$schema), `Parameter «table» cannot be a schema table on «addTable»`);
  this.validateSchema({tables: {[table]: partialSchema}});
  const relationalColumns = [];
  let sqlForMainTable = "";
  sqlForMainTable += `CREATE TABLE ${this.constructor.escapeId(table)} (`;
  sqlForMainTable += "\n  `id` INTEGER PRIMARY KEY AUTOINCREMENT";
  const columnIds = Object.keys(partialSchema.columns);
  Iterating_all_columns:
  for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
    const columnId = columnIds[indexColumn];
    const columnMetadata = partialSchema.columns[columnId];
    const columnSql = this._sqlForColumn(columnId, columnMetadata);
    if(typeof columnSql === "string") {
      sqlForMainTable += `,\n  ${columnSql}`;
    } else if(typeof columnSql === "object") {
      relationalColumns.push(columnSql.relational);
    } else {
      throw new Error("This error should not have ever arised");
    }
  }
  sqlForMainTable += `\n);`;
  this.runSql(sqlForMainTable);
  Iterating_relational_columns:
  for(let indexColumn=0; indexColumn<relationalColumns.length; indexColumn++) {
    const columnId = relationalColumns[indexColumn];
    const columnMetadata = partialSchema.columns[columnId];
    const referredTable = columnMetadata.referredTable;
    this._createRelationalTable(table, columnId, referredTable);
  }
  this.$schema.tables[table] = partialSchema;
  this._persistSchema();
};