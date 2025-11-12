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
  console.log(this.$database);
  const matchedNodes = this.$database.selectMany(this.$options.$table, [
    [this.$options.columnForPath, "=", filepath]
  ]);
  if(matchedNodes.length === 0) {
    output = this.$database.insertOne(this.$table, {
      [this.$options.columnForPath]: filepath,
      [this.$options.columnForType]: "file",
      [this.$options.columnForContent]: content,
    });
  } else if(matchedNodes.length === 1) {
    output = this.$database.updateOne(this.$table, matchedNodes[0].id, {
      [this.$options.columnForPath]: filepath,
      [this.$options.columnForType]: "file",
      [this.$options.columnForContent]: content,
    });
  } else {
    throw new Error("Multiple values with the same path error (1)");
  }
  return output;
};