/**
 * 
 * ### `Flowsql.prototype.insertOne(table:String, item:Object):Number`
 * 
 * Método que inserta una fila.
 * 
 * Por debajo llama a `Flowsql.prototype._insertMany` pasándole `item:Object` dentro de un array, de 1 solo ítem.
 * 
 * Devuelve el identificador de la nueva fila recién insertada.
 * 
 */
module.exports = function(table, item) {
  this.trace("insertOne");
  const insertedIds = this._insertMany(table, [item], "insertOne");
  return insertedIds[0];
};