/**
 * 
 * ### `FlowsqlBrowser.prototype._loadSchema()`
 * 
 * Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.
 * 
 */
module.exports = async function () {
  this.trace("_loadSchema|Browser");
  const schemaQuery = await this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  const schemaData = this._compactResults(schemaQuery);
  this.constructor.assertion(Array.isArray(schemaData), `Could not match «db.schema» on database «Database_metadata» on «_loadSchema»`);
  this.constructor.assertion(schemaData.length === 1, `Could not find «db.schema» on database «Database_metadata» on «_loadSchema»`);
  const schemaJson = schemaData[0].value;
  this.constructor.assertion(typeof schemaJson === "string", `Value of «db.schema» on database «Database_metadata» must be a string on «_loadSchema»`);
  const schema = JSON.parse(schemaJson);
  this.$schema = schema;
};