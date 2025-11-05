/**
 * 
 * ### `Flowsql.prototype.trace(method:String, args:Array)`
 * 
 * Método que...
 * 
 */
module.exports = function(method, args = []) {
  if(this.$options.trace) {
    console.log("[trace][flowsql]", method, args.length === 0 ? "" : args.map(arg => typeof arg).join(", "));
  }
};