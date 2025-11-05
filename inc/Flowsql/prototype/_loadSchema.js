/**
 * 
 * ### `Flowsql.prototype._loadSchema()`
 * 
 * Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.
 * 
 */
module.exports = function () {
  const schemaQuery = this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  this.constructor.assertion(schemaQuery.length === 1, `Could not reach schema from database on «loadSchema»`);
  const schema = JSON.parse(schemaQuery[0].value);
  this.$schema = schema;
};