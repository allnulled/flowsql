/**
 * 
 * ### `Flowsql.prototype._selectMany(table:String, filters:Array, byMethod:String)`
 * 
 * Método que selecciona múltiples filas según criterios especificados en `filters:Array`.
 * 
 * Este método interno se usa en todos los métodos CRUD.
 * 
 * Retorna la instancia normal de la tabla, y, adjuntos, los campos que relacionales también.
 * 
 * Por lo cual, no es un `SELECT` simple en sql, sino que son (potencialmente, al menos) varios.
 * 
 * Los `filters:Array` son condiciones conjuntadas por un `AND` lógico.
 * 
 * Los filtros deben seguir la siguiente lógica:
 * 
 * - `filters[n][0]`: la columna contra la que se va a comprobar.
 * - `filters[n][1]`: el operador lógico que se va a usar. Se aceptan los especificados por `Flowsql.knownOperators`, que son:
 *    - `=`
 *    - `!=`
 *    - `<`
 *    - `<=`
 *    - `>`
 *    - `>=`
 *    - `is null`: no acepta complemento comparador
 *    - `is not null`: no acepta complemento comparador
 *    - `is like`: acepta String con `%` como en SQL.
 *    - `is not like`: acepta String con `%` como en SQL.
 *    - `is in`: el complemento comparador debe ser un Array
 *    - `is not in`: el complemento comparador debe ser un Array
 *    - `has`: solo contra columnas relacionales
 *    - `has not`: solo contra columnas relacionales
 * - `filters[n][2]`: el complemento comparador
 * 
 * 
 */
module.exports = function (table, filters, byMethod = "_selectMany") {
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «${byMethod}»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «${byMethod}»`);
  this._validateFilters(table, filters);
  let mainResults = null;
  Execute_query: {
    let mainQuery = "";
    mainQuery += `SELECT * `;
    mainQuery += `\n  FROM ${this.constructor.escapeId(table)}`;
    let queryFilters = this._sqlForWhere(table, filters);
    mainQuery += queryFilters + ";";
    mainResults = this.fetchSql(mainQuery);
  }
  Expand_relational_columns: {
    if (mainResults.length === 0) {
      break Expand_relational_columns;
    }
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    const mainIds = mainResults.map(row => row.id);
    Inflate_relational_columns:
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = allColumns[columnId];
      if (columnMetadata.type !== "array-reference") {
        continue Inflate_relational_columns;
      }
      const relationalTable = `Rel_x_${table}_x_${columnId}`;
      let relationalQuery = "";
      relationalQuery += `SELECT *`;
      relationalQuery += `\n  FROM ${this.constructor.escapeId(relationalTable)}`;
      relationalQuery += `\n  WHERE id_source IN (\n    ${mainIds.join(",\n    ")}\n  );`;
      const relationalRows = this.fetchSql(relationalQuery);
      for (let indexRows = 0; indexRows < mainResults.length; indexRows++) {
        const resultRow = mainResults[indexRows];
        resultRow[columnId] = relationalRows.filter(row => row.id_source === resultRow.id).sort((a, b) => {
          if (a.sorter > b.sorter) {
            return -1;
          } else if (a.sorter < b.sorter) {
            return 1;
          } else {
            return 0;
          }
        }).map(row => row.id_destination);
      }
    }
  }
  Apply_relational_filters: {
    Iterating_filters:
    for (let indexFilter = 0; indexFilter < filters.length; indexFilter++) {
      const filter = filters[indexFilter];
      const [columnId, operator, comparator] = filter;
      if (["has", "has not"].indexOf(operator) === -1) {
        continue Iterating_filters;
      }
      mainResults = mainResults.filter((row) => {
        const relationalIds = row[columnId];
        let hasIt = false;
        if (Array.isArray(comparator)) {
          hasIt = this.constructor.arrayContainsAnyOf(relationalIds, comparator);
        } else {
          hasIt = relationalIds.indexOf(comparator) !== -1;
        }
        if (operator === "has") {
          return hasIt;
        } else if (operator === "has not") {
          return !hasIt;
        }
      });
    }
  }
  return mainResults;
};