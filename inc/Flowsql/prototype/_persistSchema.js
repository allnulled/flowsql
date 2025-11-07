/**
 * 
 * ### `Flowsql.prototype._persistSchema()`
 * 
 * Método para actualizar el dato del esquema en la base de datos (tabla `Database_metadata`, clave `db.schema`) con el valor actual de la instancia Flowsql, en `this.$schema`. Se guarda en formato JSON.
 * 
 * Hace el proceso inverso de `Flowsql.prototype._loadSchema()`: persiste de instancia a base de datos.
 * 
 * Por dentro, hace un `UPDATE` en sql.
 * 
 */
module.exports = function() {
  this.trace("_persistSchema");
  return this.runSql(`
    UPDATE Database_metadata
    SET value = ${this.constructor.escapeValue(JSON.stringify(this.$schema))}
    WHERE name = 'db.schema';
  `);
};