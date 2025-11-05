/**
 * 
 * ### `Flowsql.prototype.addColumn(table:String, columnId:String, partialSchema:Object)`
 * 
 * Método que añade una columna al esquema sql.
 * 
 * El parámetro `table:String` debe existir en el esquema.
 * 
 * El parámetro `columnId:String` no debe existir en el esquema de tabla correspondiente.
 * 
 * El parámetro `partialSchema:Object` debe cumplir las validaciones correspondientes a un esquema parcial de columna.
 * 
 * Por dentro, aparte de las validaciones pertinentes, este método:
 * 
 * - Desactiva las foreign keys de la base de datos.
 * - Renombra la tabla original con un nombre temporal.
 * - Crea la misma tabla con el nombre original y la nueva columna.
 * - Inserta todos los registros originales en la nueva tabla.
 * - Elimina la tabla original con nombre temporal.
 * - Activa otra vez las foreign keys.
 * - Crea las tablas relacionales pertinentes.
 * - Cambia el esquema interno (`this.$schema.tables[table]`) con el proporcionado.
 * - Persiste el nuevo esquema en la base de datos
 * 
 * Esto se hace así porque el sql no permite añadir limpiamente una columna con claves foráneas.
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