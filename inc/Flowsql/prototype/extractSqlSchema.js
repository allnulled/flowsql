/**
 * 
 * ### `Flowsql.prototype.extractSqlSchema()`
 * 
 * Método que...
 * 
 */
module.exports = function() {
  const schema = { tables: {} };
  // 1. Listar todas las tablas del esquema principal (no las internas de sqlite_)
  const tables = this.$database.prepare(`
    SELECT name 
    FROM sqlite_master 
    WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();
  for (const { name: tableName } of tables) {
    const table = { columns: {}, foreignKeys: [] };
    // 2. Obtener las columnas de la tabla
    const columns = this.$database.prepare(`PRAGMA table_info(${JSON.stringify(tableName)})`).all();
    for (const col of columns) {
      table.columns[col.name] = {
        cid: col.cid,
        name: col.name,
        type: col.type,
        nullable: !col.notnull,
        defaultValue: col.dflt_value,
        primaryKey: !!col.pk
      };
    }
    // 3. Obtener las claves foráneas
    const foreignKeys = this.$database.prepare(`PRAGMA foreign_key_list(${JSON.stringify(tableName)})`).all();
    for (const fk of foreignKeys) {
      table.foreignKeys.push({
        id: fk.id,
        seq: fk.seq,
        column: fk.from,        // columna local
        referredTable: fk.table,      // tabla referida
        referredColumn: fk.to,            // columna remota
        on_update: fk.on_update,
        on_delete: fk.on_delete,
        match: fk.match
      });
    }
    schema.tables[tableName] = table;
  }
  return schema;
};