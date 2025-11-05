/**
 * 
 * ### `Flowsql.prototype.selectMany(table:String, filters:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function (table, filters = []) {
  this.trace("selectMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «selectMany»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «selectMany»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «selectMany»`);
  this._validateFilters(table, filters);
  let mainResults = null;
  Execute_query: {
    let mainQuery = "";
    mainQuery += `SELECT * `;
    mainQuery += `\n   FROM ${this.constructor.escapeId(table)}`;
    let queryFilters = this._sqlForWhere(table, filters);
    mainQuery += queryFilters + ";";
    mainResults = this.fetchSql(mainQuery);
  }
  Expand_relational_columns: {
    if(mainResults.length === 0) {
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
      relationalQuery += `\n   FROM ${this.constructor.escapeId(relationalTable)}`;
      relationalQuery += `\n  WHERE id_source IN (\n       ${mainIds.join(",\n       ")}\n  )`;
      const relationalRows = this.fetchSql(relationalQuery);
      for(let indexRows=0; indexRows<mainResults.length; indexRows++) {
        const resultRow = mainResults[indexRows];
        resultRow[columnId] = relationalRows.filter(row => row.id_source === resultRow.id).sort((a,b) => {
          if(a.sorter > b.sorter) {
            return -1;
          } else if(a.sorter < b.sorter) {
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
    for(let indexFilter=0; indexFilter<filters.length; indexFilter++) {
      const filter = filters[indexFilter];
      const [columnId, operator, comparator] = filter;
      if(["has", "has not"].indexOf(operator) === -1) {
        continue Iterating_filters;
      }
      mainResults = mainResults.filter((row) => {
        const relationalIds = row[columnId];
        let hasIt = false;
        if(Array.isArray(comparator)) {
          hasIt = this.constructor.arrayContainsAnyOf(relationalIds, comparator);
        } else {
          hasIt = relationalIds.indexOf(comparator) !== -1;
        }
        if(operator === "has") {
          return hasIt;
        } else if(operator === "has not") {
          return !hasIt;
        }
      });
    }
  }
  return mainResults;
};