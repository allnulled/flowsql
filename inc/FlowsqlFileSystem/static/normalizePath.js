/**
 * 
 * ### `FlowsqlFilesystem.normalizePath(...pathParts:Array<String>):String`
 * 
 * Método que construye una ruta a partir de sus fragmentos con `...pathParts:Array<String>`.
 * 
 * Retorna la ruta formada en formato `String`.
 *  
 */
module.exports = function(...subpaths) {
  let output = "";
  for(let indexSubpath=0; indexSubpath<subpaths.length; indexSubpath++) {
    const subpath = subpaths[indexSubpath];
    this.assertion(typeof subpath === "string", `Parameter «subpaths» on index «${indexSubpath}» must be a string on «FlowsqlFileSystem.normalizePath»`);
    output += "/" + subpath.replace(/^\//g, "");
  }
  if(output === "") {
    output = "/";
  }
  return output.replace(/\/\/+/g, "/");
};