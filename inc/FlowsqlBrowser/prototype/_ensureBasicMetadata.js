/**
 * 
 * ### `await FlowsqlBrowser.prototype._ensureBasicMetadata():Promise`
 * 
 * Método que construye las tablas necesarias para gestionar los metadatos de `flowsql`.
 * 
 * Con este método se crea la tabla `Database_metadata` y se inserta el esquema con:
 * 
 * - `name=db.schema` este es el campo de la clave o id del parámetro del metadato.
 * - `value=...` iría el esquema de datos dentro en formato JSON
 * 
 */
module.exports = async function () {
  this.trace("_ensureBasicMetadata|Browser");
  await this.runSql(`
    CREATE TABLE IF NOT EXISTS Database_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) UNIQUE NOT NULL,
      value TEXT
    );
  `);
  const schemaData = await this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  if (schemaData.length !== 0) {
    console.log("not inserting");
    return;
  }
  const defaultSchema = this.constructor.escapeValue(JSON.stringify({ tables: {} }));
  await this.runSql(`
    INSERT INTO Database_metadata (name, value)
    VALUES ('db.schema', ${defaultSchema});
  `);
};