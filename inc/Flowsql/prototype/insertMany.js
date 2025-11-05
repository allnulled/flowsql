/**
 * 
 * ### `Flowsql.prototype.insertMany(table:String, rows:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function (table, rows) {
  this.trace("insertMany");
  const mainIds = [];
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const relationalColumns = columnIds.filter(columnId => {
    return allColumns[columnId].type === "array-reference";
  });
  Iterating_rows:
  for (let indexRow = 0; indexRow < rows.length; indexRow++) {
    const row = rows[indexRow];
    this._validateInstance(table, row, "insert");
    let sql = "";
    sql += this._sqlForInsertInto(table, row);
    sql += this._sqlForInsertValues(table, row);
    const insertedId = this.insertSql(sql);
    mainIds.push(insertedId);
    Insert_relational_rows: {
      Iterating_relational_columns:
      for (let indexColumn = 0; indexColumn < relationalColumns.length; indexColumn++) {
        const relationalColumn = relationalColumns[indexColumn];
        if (!(relationalColumn in row)) {
          continue Iterating_relational_columns;
        }
        const relationalTable = `Rel_x_${table}_x_${relationalColumn}`;
        const relationalValues = row[relationalColumn];
        Iterating_relational_values:
        for (let indexValue = 0; indexValue < relationalValues.length; indexValue++) {
          const value = relationalValues[indexValue];
          let relationalSql = ``;
          relationalSql += `INSERT INTO ${this.constructor.escapeId(relationalTable)} (\n  id_source,\n  id_destination,\n  sorter\n)`;
          relationalSql += ` VALUES (`;
          relationalSql += `\n  ${insertedId},`;
          relationalSql += `\n  ${this.constructor.escapeValue(value)},`;
          relationalSql += `\n  1`;
          relationalSql += `\n);`;
          this.insertSql(relationalSql);
        }
      }
    }
  }
  return mainIds;
};