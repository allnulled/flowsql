/**
 * 
 * ### `Flowsql.prototype._persistSchema()`
 * 
 * Método para actualizar el dato del esquema en la base de datos (tabla `Database_metadata`, clave `db.schema`) con el valor actual de la instancia Flowsql, en `this.$schema`. Se guarda en formato JSON.
 * 
 * Hace el proceso inverso de `Flowsql.prototype._loadSchema()`: de instancia a base de datos.
 * 
 */
module.exports = function() {
  this.runSql(`
    UPDATE Database_metadata
    SET value = ${this.constructor.escapeValue(JSON.stringify(this.$schema))}
    WHERE name = 'db.schema';
  `);
};