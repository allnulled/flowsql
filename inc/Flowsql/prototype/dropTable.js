/**
 * 
 * ### `Flowsql.prototype.dropTable(table:String)`
 * 
 * Método que...
 * 
 */
module.exports = function(table) {
  this.trace("dropTable", [...arguments]);
  Eliminar_tablas_relacionales: {
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = this.$schema.tables[table].columns[columnId];
      const isRelationalColumn = columnMetadata.type === "array-reference";
      if(isRelationalColumn) {
        const relationalTable = `Rel_x_${table}_x_${columnId}`;
        this.runSql(`DROP TABLE ${this.constructor.escapeId(relationalTable)};`);
      }
    }
  }
  this.runSql(`DROP TABLE ${this.constructor.escapeId(table)};`);
  delete this.$schema.tables[table];
};