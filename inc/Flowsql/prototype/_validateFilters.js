/**
 * 
 * ### `Flowsql.prototype._validateFilters(table:String, filters:Array)`
 * 
 * Método que sirve para validar los filtros que se le pasan a un `Flowsql.prototype.selectMany(table, filters)`.
 * 
 * Se comprobarán varios aspectos:
 * 
 * - que sea un array
 * - que contenga arrays
 * - que la columna exista en el esquema
 * - que el operador de regla exista entre los operadores conocidos
 * - que el operador de regla tenga coherencia con el tipo de la columna
 * - que el comparador de regla tenga coherencia con el tipo de la columna
 * 
 */
module.exports = function (table, filters) {
  this.trace("_validateFilters");
  const tableSchema = this.$schema.tables[table];
  const allColumns = tableSchema.columns;
  const columnIds = Object.keys(allColumns).concat(["id"]);
  Iterating_filters:
  for (let indexFilter = 0; indexFilter < filters.length; indexFilter++) {
    const filter = filters[indexFilter];
    this.assertion(Array.isArray(filter), `Parameter «filters[${indexFilter}]» must be an array on «selectMany»`);
    const [columnId, operator, complement] = filter;
    this.assertion(columnIds.indexOf(columnId) !== -1, `Parameter «filters[${indexFilter}][0]» must be a schema column on «selectMany»`);
    this.assertion(this.constructor.knownOperators.indexOf(operator) !== -1, `Parameter «filters[${indexFilter}][1]» must be a valid operator on «selectMany»`);
    if (columnId === "id") {
      continue Iterating_filters;
    }
    const columnType = allColumns[columnId].type;
    if (["is null", "is not null"].indexOf(operator) !== -1) {
      this.assertion(allColumns[columnId].nullable === true, `Parameter «filters[${indexFilter}][1]» cannot be «is null|is not null» because the column is not nullable on «selectMany»`);
      this.assertion(typeof complement === "undefined", `Parameter «filters[${indexFilter}][2]» must be empty on «is null|is not null» filter on «selectMany»`);
    } else if (["has", "has not"].indexOf(operator) !== -1) {
      this.assertion(columnType === "array-reference", `Parameter «filters[${indexFilter}]» is filtering by «has|has not» on a column that is not type «array-reference» on «selectMany»`);
      this.assertion((typeof complement === "number") || Array.isArray(complement), `Parameter «filters[${indexFilter}][2]» must be a number or an array on «has|has not» filter on «selectMany»`);
    } else if (["is like", "is not like"].indexOf(operator) !== -1) {
      this.assertion(columnType === "string", `Parameter «filters[${indexFilter}]» is filtering by «is like|is not like» on a column that is not type «string» on «selectMany»`);
      this.assertion(typeof complement === "string", `Parameter «filters[${indexFilter}][2]» must be a string on «is like|is not like» filter on «selectMany»`);
    } else if (["is in", "is not in"].indexOf(operator) !== -1) {
      this.assertion(Array.isArray(complement), `Parameter «filters[${indexFilter}][2]» must be an array on «is in|is not in» filter on «selectMany»`);
    } else if (["=", "!=", "<", "<=", ">", ">="].indexOf(operator) !== -1) {
      if (columnType === "string") {
        this.assertion(typeof complement === "string", `Parameter «filters[${indexFilter}][2]» must be a string because it is comparing a «string» column type on «selectMany»`);
      } else if (["real", "integer"].indexOf(columnType) !== -1) {
        this.assertion(typeof complement === "number", `Parameter «filters[${indexFilter}][2]» must be a number because it is comparing a «integer|real» column type on «selectMany»`);
      } else if (["date", "datetime"].indexOf(columnType) !== -1) {
        this.assertion(typeof complement === "string", `Parameter «filters[${indexFilter}][2]» must be a string because it is comparing a «date|datetime» column type on «selectMany»`);
      } else if ("boolean" === columnType) {
        this.assertion(["boolean", "number"].indexOf(typeof complement) !== -1, `Parameter «filters[${indexFilter}][2]» must be a boolean or a number because it is comparing a «boolean» column type on «selectMany»`);
      } else {
        throw new Error(`Parameter «filters[${indexFilter}][1]» is applying on a column that does not accept the operator «${operator}» on «selectMany»`);
      }
    } else {
      throw new Error(`Operator «filters[${indexFilter}][1]» which is «${operator}» is not a valid operator on «selectMany»`);
    }
  }
}