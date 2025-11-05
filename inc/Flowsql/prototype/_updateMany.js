/**
 * 
 * ### `Flowsql.prototype._updateMany(table:String, filters:Array, values:Object, byMethod:String)`
 * 
 * Método que actualiza múltiples filas a la vez.
 * 
 */
module.exports = function (table, filters, values, byMethod = "_updateMany") {
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «${byMethod}»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «${byMethod}»`);
  this.assertion(typeof values === "object", `Parameter «values» must be an object on «${byMethod}»`);
  this._validateInstance(table, values, "update");
  const matchedRows = this._selectMany(table, filters, "updateMany");
  const matchedIds = matchedRows.map(row => row.id);
  const nonRelationalColumns = [];
  Updating_relational_columns: {
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    const relationalColumns = [];
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      if (allColumns[columnId].type === "array-reference") {
        relationalColumns.push(columnId);
      } else {
        nonRelationalColumns.push(columnId);
      }
    }
    Iterating_relational_columns:
    for (let indexRelational = 0; indexRelational < relationalColumns.length; indexRelational++) {
      const columnId = relationalColumns[indexRelational];
      if (!(columnId in values)) {
        continue Iterating_relational_columns;
      }
      const relationalTable = `Rel_x_${table}_x_${columnId}`;
      const relationalValues = values[columnId];
      const escapedRelationalValue = relationalValues.map(id => this.constructor.escapeValue(id)).join(",");
      let relationalSql = "";
      relationalSql += `DELETE FROM ${this.constructor.escapeId(relationalTable)}`;
      relationalSql += `\n  WHERE id_source IN (${matchedIds.map(id => this.constructor.escapeValue(id)).join(", ")});`;
      this.runSql(relationalSql);
    }
  }
  const hasNonRelational = this.constructor.arrayContainsAnyOf(Object.keys(values), nonRelationalColumns);
  if (hasNonRelational) {
    let sql = "";
    sql += `UPDATE ${this.constructor.escapeId(table)}`;
    sql += `\n  SET ${this._sqlForUpdateSet(table, values)}`;
    sql += `\n  WHERE id IN (${matchedIds.join(",")})`;
    sql += ";";
    this.runSql(sql);
  }
  return matchedIds;
};