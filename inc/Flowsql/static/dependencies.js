/**
 * 
 * ### `Flowsql.dependencies:Object`
 * 
 * Objeto que sirve para inyectar framework externos en la instancia de `Flowsql`.
 * 
 * Tiene los siguientes valores:
 * 
 * ```js
 * {
 *   sqlite3: require("better-sqlite3"),
 * }
 * ```
 * 
 */
module.exports = {
  sqlite3: require("better-sqlite3"),
};