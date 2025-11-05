/**
 * 
 * ### `Flowsql.prototype.renameTable(table:String, newName:String)`
 * 
 * Método que renombra una tabla del esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `newName:String` no puede ser una tabla del esquema.
 * 
 * Hará un `ALTER TABLE x RENAME TO y` a nivel de sql y cambiará y persistirá los cambios del esquema del `this.$schema`.
 * 
 */
module.exports = function(table, newName) {
  this.trace("renameTable", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «renameTable»`);
  this.assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameTable»`);
  this.runSql(`ALTER TABLE ${this.constructor.escapeId(table)} RENAME TO ${this.constructor.escapeId(newName)}`);
  this.$schema.tables[newName] = this.constructor.copyObject(this.$schema.tables[table]);
  delete this.$schema.tables[table];
  this._persistSchema();
};