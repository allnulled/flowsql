/**
 * 
 * ### `Flowsql.defaultDatabaseOptions:Object`
 * 
 * Objeto con las opciones que se van a pasar a `better-sqlite3` por defecto.
 * 
 * Tiene estos valores:
 * 
 * ```js
 * {
 *   readonly: false,
 *   fileMustExist: false,
 *   timeout: 5000,
 *   verbose: (...args) => { },
 * }
 * ```
 * 
 */
module.exports = {
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: (...args) => { },
};