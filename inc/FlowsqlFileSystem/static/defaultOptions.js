/**
 * 
 * ### `FileSystem.defaultOptions:Object`
 * 
 * Objeto con las columnas especiales de la tabla.
 * 
 * Puede customizarse pero lo recomendable es que no, ya que hay 1 por tabla, así que no haría falta tocar nada si se respetan los nombres y tipos.
 * 
 * Concretamente, tiene esto:
 * 
 * ```js
 * module.exports = {
 *   columnForName: "node_name",
 *   columnForType: "node_type",
 *   columnForContent: "node_content",
 *   columnForParent: "node_parent",
 * };
 * ```
 * 
 */
module.exports = {
  columnForPath: "node_path",
  columnForType: "node_type",
  columnForContent: "node_content",
  columnForParent: "node_parent",
};