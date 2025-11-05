/**
 * 
 * ### `Flowsql.prototype._createRelationalTable(table:String, columnId:String, referredTable:String)`
 * 
 * Método para generar el SQL y crear en la base de datos una tabla relacional.
 * 
 * Una tabla relacional es la que conecta una columna relacional con los ítems contenidos por esta.
 * 
 * Siempre tiene 3 campos:
 * 
 * - id_source: una referencia a la tabla origen
 * - id_destination: una referencia a la tabla referida
 * - sorter: un `Integer` con el número de prioridad, que a mayor, más prioridad, y que por defecto siempre es 1.
 * 
 * El parámetro `table:String` es el nombre de la tabla original.
 * 
 * El parámetro `columnId:String` es el nombre de la columna original.
 * 
 * El parámetro `referredTable:String` es el nombre de la tabla referida.
 * 
 * 
 */
module.exports = function (table, columnId, referredTable) {
  this.trace("_createRelationalTable");
  const relationalTableId = `Rel_x_${table}_x_${columnId}`;
  let sqlForRelationalTable = "";
  sqlForRelationalTable += `CREATE TABLE ${this.constructor.escapeId(relationalTableId)} (`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("id")} INTEGER PRIMARY KEY AUTOINCREMENT,`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("id_source")} INTEGER REFERENCES ${this.constructor.escapeId(table)} (id),`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("id_destination")} INTEGER REFERENCES ${this.constructor.escapeId(referredTable)} (id),`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("sorter")} INTEGER DEFAULT 1`;
  sqlForRelationalTable += `\n);`;
  this.runSql(sqlForRelationalTable);
};