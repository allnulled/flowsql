/**
 * 
 * ### `Flowsql.prototype._loadSchema()`
 * 
 * Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.
 * 
 */
module.exports = function () {
  this.trace("_loadSchema");
  const schemaQuery = this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  this.constructor.assertion(Array.isArray(schemaQuery), `Could not match «db.schema» on database «Database_metadata» on «_loadSchema»`);
  this.constructor.assertion(schemaQuery.length === 1, `Could not find «db.schema» on database «Database_metadata» on «_loadSchema»`);
  const schema = JSON.parse(schemaQuery[0].value);
  this.$schema = schema;
};