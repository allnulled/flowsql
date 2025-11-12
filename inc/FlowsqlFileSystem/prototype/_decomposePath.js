/**
 * 
 * ### `FlowsqlFileSystem.prototype._decomposePath(filepath:String, splitter:String = "/"):Array<String>`
 *  
 * Método que descompone en partes un path según el `splitter:String` que por defecto es el caracter "/".
 * 
 */
module.exports = function(filepath, splitter = "/") {
  const fileparts = filepath.split(splitter);
  return fileparts.filter(part => (typeof part === "undefined" ? "" : part).trim() !== "");
}