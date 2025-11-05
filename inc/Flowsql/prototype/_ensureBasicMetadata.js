/**
 * 
 * ### `Flowsql.prototype._ensureBasicMetadata()`
 * 
 * Método que construye las tablas necesarias para gestionar los metadatos de `flowsql`.
 * 
 * Con este método se crea la tabla `Database_metadata` y se inserta el esquema con:
 * 
 * - `name=db.schema` este es el campo de la clave o id del parámetro del metadato.
 * - `value=...` iría el esquema de datos dentro en formato JSON
 * 
 */
module.exports = function () {
  this.runSql(`
    CREATE TABLE IF NOT EXISTS Database_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) UNIQUE NOT NULL,
      value TEXT
    );
  `);
  const schemaQuery = this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  if (schemaQuery.length !== 0) {
    return;
  }
  const defaultSchema = this.constructor.escapeValue(JSON.stringify({ tables: {} }));
  this.runSql(`
    INSERT INTO Database_metadata (name, value)
    VALUES ('db.schema', ${defaultSchema});
  `);
};