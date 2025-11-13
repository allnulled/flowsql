/**
 * 
 * ### `FlowsqlFileSystem.prototype._copyObject(obj:Object):Array<String>`
 *  
 * Método que copia un objeto usando JSON.stringify + JSON.parse.
 * 
 */
module.exports = function(obj) {
  this.assertion(typeof obj === "object", `Parameter «obj» must be a object on «_copyObject»`);
  return JSON.parse(JSON.stringify(obj));
}