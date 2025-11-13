/**
 * 
 * ### `FlowsqlFileSystem.prototype.writeDirectory(dirpath:String)`
 * 
 * Método para crear un directorio basándose en una ruta.
 * 
 */
module.exports = function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.prototype.writeDirectory»`);
  let output = "";
  const node = this.findByPath(dirpath);
  if(node === null) {
    output = this.$flowsql.insertOne(this.$table, {
      [this.$options.columnForPath]: dirpath,
      [this.$options.columnForType]: "directory",
      [this.$options.columnForContent]: "",
    });
  } else {
    throw new Error("Cannot create directory because it already exists on «FlowsqlFileSystem.prototype.writeDirectory»");
  }
  return output;
};