/**
 * 
 * ### `Flowsql.prototype._sqlForWhere(table:String, filters:Array)`
 * 
 * Método que devuelve el código `sql` correspondiente a un `WHERE` de un select/update/delete.
 * 
 * El parámetro `filters:Array` tiene que ser un filtro aceptado por `Flowsql.prototype._selectMany(table, filters)`. Se explica más en profundidad en ese método.
 * 
 */
module.exports = function (table, filters) {
  let sql = "";
  Iterating_filters:
  for (let indexFilter = 0; indexFilter < filters.length; indexFilter++) {
    const filter = filters[indexFilter];
    const [columnId, operator, complement] = filter;
    if (["has", "has not"].indexOf(operator) !== -1) {
      continue Iterating_filters;
    } else if (["=", "!=", "<", "<=", ">", ">="].indexOf(operator) !== -1) {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} ${operator} ${this.constructor.escapeValue(complement)}`;
    } else if (operator === "is null") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} IS NULL`;
    } else if (operator === "is not null") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} IS NOT NULL`;
    } else if (operator === "is like") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} LIKE ${this.constructor.escapeValue(complement)}`;
    } else if (operator === "is not like") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} NOT LIKE ${this.constructor.escapeValue(complement)}`;
    } else {
      throw new Error("Not supported yet operator: " + operator);
    }
  }
  return sql;
};