/**
 * 
 * ### `Flowsql.prototype.addColumn(table:String, columnId:String, partialSchema:Object)`
 * 
 * Método que...
 * 
 */
module.exports = function (table, columnId, partialSchema) {
  this.trace("addColumn", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «addColumn»`);
  this.assertion(typeof columnId === "string", `Parameter «columnId» must be a string on «addColumn»`);
  this.assertion(typeof partialSchema === "object", `Parameter «partialSchema» must be an object on «addColumn»`);
  this.assertion(typeof partialSchema.type === "string", `Parameter «partialSchema.type» must be a string on «addColumn»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «addColumn»`);
  this.assertion(!(columnId in this.$schema), `Parameter «columnId» cannot be a schema column on «addColumn»`);
  this.checkSchemaValidity({tables: {[table]: {columns: {[columnId]: partialSchema}}}});
  const tableSchema = this.constructor.copyObject(this.$schema.tables[table]);
  const oldColumns = Object.keys(this.$schema.tables[table].columns).filter(columnId => {
    return this.$schema.tables[table].columns[columnId].type !== "array-reference";
  });
  tableSchema.columns[columnId] = partialSchema;
  let sqlForMainTable = "";
  sqlForMainTable += `CREATE TABLE ${this.constructor.escapeId(table)} (`;
  sqlForMainTable += "\n  `id` INTEGER PRIMARY KEY AUTOINCREMENT";
  const columnIds = Object.keys(tableSchema.columns);
  Iterating_all_columns:
  for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
    const columnId = columnIds[indexColumn];
    const columnMetadata = tableSchema.columns[columnId];
    const columnSql = this._sqlForColumn(columnId, columnMetadata);
    if(typeof columnSql === "string") {
      sqlForMainTable += `,\n  ${columnSql}`;
    } else if(typeof columnSql === "object") {
      // Relational columns can be ignored on addColumn:
      // relationalColumns.push(columnSql.relational);
    } else {
      throw new Error("This error should not have ever arised");
    }
  }
  sqlForMainTable += `\n);`;
  this.runSql("PRAGMA foreign_keys = OFF;");
  this.runSql(`ALTER TABLE ${table} RENAME TO ${table}_tmp;`);
  this.runSql(sqlForMainTable);
  this.runSql(`INSERT INTO ${table} (${oldColumns.join(", ")}) SELECT ${oldColumns.join(", ")} FROM ${table}_tmp;`);
  this.runSql(`DROP TABLE ${table}_tmp;`);
  this.runSql("PRAGMA foreign_keys = ON;");
  const requiresRelationalTable = partialSchema.type === "array-reference";
  if(requiresRelationalTable) {
    this._createRelationalTable(table, columnId, partialSchema.referredTable);
  }
  this.$schema.tables[table] = tableSchema;
  this._persistSchema();
};