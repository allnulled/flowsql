/**
 * 
 * ### `Flowsql.prototype._validateInstance(table:String, values:Object, operation:String)`
 * 
 * Método que valida una instancia dado el nombre de la tabla y un objeto.
 * 
 * El tercer parámetro sirve para distinguir si está insertando o actualizando un dato, ya que hay algunas diferencias.
 * 
 */
module.exports = function (table, values, operation) {
  this.trace("_validateInstance");
  this.assertion(["update", "insert"].indexOf(operation) !== -1, `Parameter «operation» must be «insert|update» on «_validateInstance»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const allProperties = Object.keys(values);
  for(let indexProperty=0; indexProperty<allProperties.length; indexProperty++) {
    const propertyId = allProperties[indexProperty];
    this.assertion(columnIds.indexOf(propertyId) !== -1, `Parameter «values[${propertyId}]» does not match with any known column on operation «${operation}» on «_validateInstance»`);
    // @TODO:
  }
};