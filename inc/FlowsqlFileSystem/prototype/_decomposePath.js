/**
 * 
 * ### `FlowsqlFileSystem.prototype._decomposePath(filepath:String, splitter:String = "/"):Array<String>`
 *  
 * Método que descompone en partes un path según el `splitter:String` que por defecto es el caracter "/".
 * 
 */
module.exports = function(filepath, splitter = "/") {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «_decomposePath»`);
  this.assertion(typeof splitter === "string", `Parameter «splitter» must be a string on «_decomposePath»`);
  const fileparts = filepath.split(splitter);
  return fileparts.filter(part => (typeof part === "undefined" ? "" : part).trim() !== "");
}