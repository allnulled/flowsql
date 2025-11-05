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
  this.assertion(["update", "insert"].indexOf(operation) !== -1, `Parameter «operation» must be «insert|update» on «_validateInstance»`);
  // @TODO...
};