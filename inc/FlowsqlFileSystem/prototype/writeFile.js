/**
 * 
 * ### `FlowsqlFileSystem.prototype.writeFile(filepath:String, content:String)`
 * 
 * Método para escribir en un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath, content) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.writeFile»`);
  this.assertion(typeof content === "string", `Parameter «content» must be a string on «FlowsqlFileSystem.prototype.writeFile»`);
  let output = "";
  const normalizedFilepath = this.constructor.normalizePath(filepath);
  const node = this.findByPath(normalizedFilepath);
  if(node === null) {
    output = this.$flowsql.insertOne(this.$table, {
      [this.$options.columnForPath]: normalizedFilepath,
      [this.$options.columnForType]: "file",
      [this.$options.columnForContent]: content,
    });
  } else if(node.length === 1) {
    output = this.$flowsql.updateOne(this.$table, node[0].id, {
      [this.$options.columnForPath]: normalizedFilepath,
      [this.$options.columnForType]: "file",
      [this.$options.columnForContent]: content,
    });
  } else {
    throw new Error("Cannot write file because there are multiple nodes with the same node path on «FlowsqlFileSystem.prototype.writeFile»");
  }
  return output;
};