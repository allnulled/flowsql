/**
 * 
 * ### `Flowsql.defaultOptions:Object`
 * 
 * Objeto con las opciones pasados al constructor `Flowsql.constructor` por defecto.
 * 
 * Tiene estos valores:
 * 
 * ```js
 * {
 *   trace: false,
 *   traceSql: false,
 *   filename: require("path").resolve(process.cwd(), "db.sqlite"),
 * }
 * ```
 * 
 */
module.exports = {
  trace: false,
  traceSql: false,
  filename: require("path").resolve(process.cwd(), "db.sqlite"),
};