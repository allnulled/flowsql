/**
 * 
 * ### `Flowsql.prototype.trace(method:String, args:Array)`
 * 
 * Método que imprime las trazas de los métodos llamados.
 * 
 * Utiliza el parámetro `this.$options.trace` para saber si debe o no imprimirlos.
 * 
 */
module.exports = function(method, args = []) {
  if(this.$options.trace) {
    console.log("[trace][flowsql]", method, args.length === 0 ? "" : args.map(arg => typeof arg).join(", "));
  }
};