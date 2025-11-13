/**
 * 
 * ### `FileSystem.prototype.writeFile(filepath:String, content:String)`
 * 
 * Método para escribir en un fichero basándose en una ruta.
 * 
 */
module.exports = function(filepath, content) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.writeFile»`);
  this.assertion(typeof content === "string", `Parameter «content» must be a string on «FlowsqlFileSystem.writeFile»`);
  let output = "";
  const matchedNodes = this.$flowsql.selectMany(this.$options.$table, [
    [this.$options.columnForPath, "=", filepath]
  ]);
  if(matchedNodes.length === 0) {
    output = this.$flowsql.insertOne(this.$table, {
      [this.$options.columnForPath]: filepath,
      [this.$options.columnForType]: "file",
      [this.$options.columnForContent]: content,
    });
  } else if(matchedNodes.length === 1) {
    output = this.$flowsql.updateOne(this.$table, matchedNodes[0].id, {
      [this.$options.columnForPath]: filepath,
      [this.$options.columnForType]: "file",
      [this.$options.columnForContent]: content,
    });
  } else {
    throw new Error("Multiple values with the same path error (1)");
  }
  return output;
};