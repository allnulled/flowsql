/**
 * 
 * ### `Flowsql.prototype.renameColumn(table:String, columnId:String, newName:String)`
 * 
 * Método que renombra una columna del esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `columnId:String` debe ser una columna del esquema de la tabla.
 * 
 * El parámetro `newName:String` no puede ser una columna del esquema de la tabla.
 * 
 */
module.exports = function (table, columnId, newName) {
  this.trace("renameColumn", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «renameTable»`);
  this.assertion(typeof columnId === "string", `Parameter «columnId» must be a string on «renameTable»`);
  this.assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameTable»`);
  this.runSql(`ALTER TABLE ${table} RENAME COLUMN ${columnId} TO ${newName};`);
  this.$schema.tables[table].columns[newName] = this.constructor.copyObject(this.$schema.tables[table].columns[columnId]);
  delete this.$schema.tables[table].columns[columnId];
  this._persistSchema();
  // @TODO...
};