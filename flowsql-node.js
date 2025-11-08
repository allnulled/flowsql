

const Flowsql = /**
 * 
 * ### `Flowsql.constructor(options:Object)`
 * 
 * Método que construye una instancia `Flowsql`.
 * 
 * El parámetro `options:Object` sobreescribirá las `this.constructor.defaultOptions`.
 * 
 * El parámetro `options.databaseOptions:Object` sobreescribirá las `this.constructor.defaultDatabaseOptions`.
 * 
 * Luego, además, llama a `this.connect()` directamente. Es decir que en el momento de crear la instancia, ya se abre la conexión sqlite.
 * 
 */
function(options = {}) {
  this.$database = null;
  this.$schema = { tables: {} };
  this.$options = Object.assign({}, this.constructor.defaultOptions, options);
  this.$options.databaseOptions = Object.assign({}, this.constructor.defaultDatabaseOptions, options.databaseOptions || {});
  console.log("[*] Connecting to Flowsql database from file: " + this.$options.filename);
  this.connect();
  return this;
};

Flowsql.create = /**
 * 
 * ### `Flowsql.create(...args)`
 * 
 * Método que construye una instancia con `Flowsql.constructor`.
 * 
 * Es un *wrapper* del constructor, para no tener que usar `new`.
 * 
 */
function(...args) {
  return new this(...args);
};
Flowsql.assertion = /**
 * 
 * ### `Flowsql.assertion(condition:boolean, errorMessage:String)`
 * 
 * Método que hace una aserción y, de no cumplirse, lanza un mensaje de error.
 * 
 * Es un método utilitario usado por muchas partes de la aplicación.
 * 
 * Lanza errores de tipo `AssertionError`.
 *  
 */
function(assertion, errorMessage = "assertion failed") {
  if(!assertion) {
    throw new this.AssertionError(errorMessage);
  }
};
Flowsql.AssertionError = /**
 * 
 * ### `new Flowsql.AssertionError(message:String)`
 * 
 * Clase que extiende de `Error`. Sirve para especificar errores de tipo aserción.
 * 
 */
class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};
Flowsql.defaultOptions = /**
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
{
  trace: false,
  traceSql: false,
  filename: require("path").resolve(process.cwd(), "db.sqlite"),
};
Flowsql.defaultDatabaseOptions = /**
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
{
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: (...args) => { },
};
Flowsql.dependencies = /**
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
{
  sqlite3: require("better-sqlite3"),
};
Flowsql.escapeId = /**
 * 
 * ### `Flowsql.escapeId(value:any)`
 * 
 * Método que sirve para escapar identificadores en la sintaxis sql.
 * 
 */
function(value) {
  return "`" + value.replace(/`/g, "") + "`";
};
Flowsql.escapeValue = /**
 * 
 * ### `Flowsql.escapeValue(value:any)`
 * 
 * Método que escapa valores en la sintaxis sql.
 * 
 */
function(value) {
  if(typeof value === "string") {
    return "'" + value.replace(/'/g, "''") + "'";
  }
  return value;
};
Flowsql.getSqlType = /**
 * 
 * ### `Flowsql.getSqlType(columnType:String, columnMetadata:Object)`
 * 
 * Método que devuelve el código sql correspondiente a un tipo del `this.$schema[table].columns[columnId].type`.
 * 
 * Este método mapea los tipos de `flowsql` a `sql`.
 * 
 * Solo acepta los tipos:
 * 
 *  - `boolean`: a `INTEGER`
 *  - `real`: a `REAL`
 *  - `integer`: a `BLOB`
 *  - `string`: a `TEXT` o `VARCHAR`
 *  - `blob`: a `BLOB`
 *  - `date`: a `DATE`
 *  - `datetime`: a `DATETIME`
 *  - `object`: a `TEXT`
 *  - `array`: a `TEXT`
 *  - `object-reference`: a `INTEGER`
 *  - `array-reference`: este tipo no se acepta por este método, se procesan por otro lado.
 * 
 */
function(columnType, columnMetadata) {
  if(columnType === "string") {
    if(columnMetadata.maxLength) {
      return `VARCHAR(${columnMetadata.maxLength})`;
    } else {
      return `TEXT`;
    }
  }
  if(columnType === "real") {
    return "REAL";
  }
  if(columnType === "blob") {
    return "BLOB";
  }
  if(columnType === "date") {
    return "DATE";
  }
  if(columnType === "datetime") {
    return "DATETIME";
  }
  if(columnType === "object-reference") {
    return `INTEGER REFERENCES ${columnMetadata.referredTable} (id)`;
  }
  if(columnType === "object") {
    return `TEXT`;
  }
  if(columnType === "array") {
    return "TEXT";
  }
  if(columnType === "boolean") {
    return "INTEGER";
  }
  if(columnType === "integer") {
    return "INTEGER";
  }
  throw new Error(`Parameter «columnType=${columnType}» is not identified as type on «getSqlType»`);
};
Flowsql.knownTypes = /**
 * 
 * ### `Flowsql.knownTypes:Array`
 * 
 * Array que contiene los tipos conocidos por `flowsql`.
 * 
 * Tiene los siguientes valores:
 * ```js
 * [
 *   "boolean",
 *   "integer",
 *   "real",
 *   "string",
 *   "blob",
 *   "date",
 *   "datetime",
 *   "object",
 *   "array",
 *   "object-reference",
 *   "array-reference",
 * ];
 * ``` 
 */
[
  "boolean",
  "integer",
  "real",
  "string",
  "blob",
  "date",
  "datetime",
  "object",
  "array",
  "object-reference",
  "array-reference",
];
Flowsql.knownOperators = /**
 * 
 * ### `Flowsql.knownOperators:Array`
 * 
 * Array que contiene los operadores conocidos por `flowsql`.
 * 
 * Tiene los siguientes valores:
 * 
 * ```js
 * [
 *   "=",
 *   "!=",
 *   "<",
 *   "<=",
 *   ">",
 *   ">=",
 *   "is null",
 *   "is not null",
 *   "is in",
 *   "is not in",
 *   "is like",
 *   "is not like",
 *   "has",
 *   "has not",
 * ];
 * ```
 * 
 */
[
  "=",
  "!=",
  "<",
  "<=",
  ">",
  ">=",
  "is null",
  "is not null",
  "is in",
  "is not in",
  "is like",
  "is not like",
  "has",
  "has not",
];
Flowsql.copyObject = /**
 * 
 * ### `Flowsql.copyObject(obj:Object)`
 * 
 * Método que copia un objeto JSON y lo devuelve.
 * 
 * Utiliza `JSON.parse(JSON.stringify(obj))`.
 * 
 */
function(obj) {
  return JSON.parse(JSON.stringify(obj));
};
Flowsql.arrayContainsAnyOf = /**
 * 
 * ### `Flowsql.arrayContainsAnyOf(list1:Array, list2:Array):Boolean`
 * 
 * Método que comprueba si hay elementos comunes entre 2 listas de elementos.
 * 
 */
function(a, b) {
  if (a.length > b.length) {
    [a, b] = [b, a]; // iterar la más corta
  }
  const set = new Set(b);
  for (let i = 0; i < a.length; i++) {
    if (set.has(a[i])) return true;
  }
  return false;
};

Flowsql.prototype._ensureBasicMetadata = /**
 * 
 * ### `Flowsql.prototype._ensureBasicMetadata()`
 * 
 * Método que construye las tablas necesarias para gestionar los metadatos de `flowsql`.
 * 
 * Con este método se crea la tabla `Database_metadata` y se inserta el esquema con:
 * 
 * - `name=db.schema` este es el campo de la clave o id del parámetro del metadato.
 * - `value=...` iría el esquema de datos dentro en formato JSON
 * 
 */
function() {
  this.trace("_ensureBasicMetadata");
  this.runSql(`
    CREATE TABLE IF NOT EXISTS Database_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) UNIQUE NOT NULL,
      value TEXT
    );
  `);
  const schemaQuery = this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  if (schemaQuery.length !== 0) {
    return;
  }
  const defaultSchema = this.constructor.escapeValue(JSON.stringify({ tables: {} }));
  this.runSql(`
    INSERT INTO Database_metadata (name, value)
    VALUES ('db.schema', ${defaultSchema});
  `);
};
Flowsql.prototype._loadSchema = /**
 * 
 * ### `Flowsql.prototype._loadSchema()`
 * 
 * Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.
 * 
 */
function() {
  this.trace("_loadSchema");
  const schemaQuery = this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  this.constructor.assertion(Array.isArray(schemaQuery), `Could not match «db.schema» on database «Database_metadata» on «_loadSchema»`);
  this.constructor.assertion(schemaQuery.length === 1, `Could not find «db.schema» on database «Database_metadata» on «_loadSchema»`);
  const schema = JSON.parse(schemaQuery[0].value);
  this.$schema = schema;
};
Flowsql.prototype._persistSchema = /**
 * 
 * ### `Flowsql.prototype._persistSchema()`
 * 
 * Método para actualizar el dato del esquema en la base de datos (tabla `Database_metadata`, clave `db.schema`) con el valor actual de la instancia Flowsql, en `this.$schema`. Se guarda en formato JSON.
 * 
 * Hace el proceso inverso de `Flowsql.prototype._loadSchema()`: persiste de instancia a base de datos.
 * 
 * Por dentro, hace un `UPDATE` en sql.
 * 
 */
function() {
  this.trace("_persistSchema");
  return this.runSql(`
    UPDATE Database_metadata
    SET value = ${this.constructor.escapeValue(JSON.stringify(this.$schema))}
    WHERE name = 'db.schema';
  `);
};
Flowsql.prototype._createRelationalTable = /**
 * 
 * ### `Flowsql.prototype._createRelationalTable(table:String, columnId:String, referredTable:String)`
 * 
 * Método para generar el SQL y crear en la base de datos una tabla relacional.
 * 
 * Una tabla relacional es la que conecta una columna relacional con los ítems contenidos por esta.
 * 
 * Siempre tiene 3 campos:
 * 
 * - id_source: una referencia a la tabla origen
 * - id_destination: una referencia a la tabla referida
 * - sorter: un `Integer` con el número de prioridad, que a mayor, más prioridad, y que por defecto siempre es 1.
 * 
 * El parámetro `table:String` es el nombre de la tabla original.
 * 
 * El parámetro `columnId:String` es el nombre de la columna original.
 * 
 * El parámetro `referredTable:String` es el nombre de la tabla referida.
 * 
 * 
 */
function(table, columnId, referredTable) {
  this.trace("_createRelationalTable");
  const relationalTableId = `Rel_x_${table}_x_${columnId}`;
  let sqlForRelationalTable = "";
  sqlForRelationalTable += `CREATE TABLE ${this.constructor.escapeId(relationalTableId)} (`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("id")} INTEGER PRIMARY KEY AUTOINCREMENT,`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("id_source")} INTEGER REFERENCES ${this.constructor.escapeId(table)} (id),`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("id_destination")} INTEGER REFERENCES ${this.constructor.escapeId(referredTable)} (id),`;
  sqlForRelationalTable += `\n  ${this.constructor.escapeId("sorter")} INTEGER DEFAULT 1`;
  sqlForRelationalTable += `\n);`;
  this.runSql(sqlForRelationalTable);
};
Flowsql.prototype._validateFilters = /**
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
function(table, filters) {
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
Flowsql.prototype._sqlForColumn = /**
 * 
 * ### `Flowsql.prototype._sqlForColumn(columnId:String, columnMetadata:Object)`
 * 
 * Método que devuelve el código `sql` que describe la columna especificada.
 * 
 * Consultará los valores:
 * 
 * - `columnMetadata.type` que debe ser uno de los `Flowsql.knownTypes` donde se incluyen:
 *    - `"boolean"`
 *    - `"integer"`
 *    - `"real"`
 *    - `"string"`
 *    - `"blob"`
 *    - `"date"`
 *    - `"datetime"`
 *    - `"object"`
 *    - `"array"`
 *    - `"object-reference"`
 *    - `"array-reference"`
 * - `columnMetadata.unique` que por defecto sería `false`.
 * - `columnMetadata.nullable` que por defecto sería `false`, es decir, por defecto todas las columnas son `NOT NULL`.
 * - `columnMetadata.defaultBySql` que no tiene un valor por defecto.
 * 
 */
function(columnId, columnMetadata) {
  this.trace("_sqlForColumn");
  const columnType = columnMetadata.type;
  if (columnType === "array-reference") {
    return {
      relational:columnId
    };
  }
  const sqlType = this.constructor.getSqlType(columnType, columnMetadata);
  let sql = "";
  sql += `${this.constructor.escapeId(columnId)} ${sqlType}`;
  if (columnMetadata.unique) {
    sql += ` UNIQUE`;
  }
  if (columnMetadata.nullable !== true) {
    sql += ` NOT NULL`;
  }
  if (columnMetadata.defaultBySql) {
    sql += ` DEFAULT ${columnMetadata.defaultBySql}`;
  }
  return sql;
}
Flowsql.prototype._sqlForWhere = /**
 * 
 * ### `Flowsql.prototype._sqlForWhere(table:String, filters:Array)`
 * 
 * Método que devuelve el código `sql` correspondiente a un `WHERE` de un select/update/delete.
 * 
 * El parámetro `filters:Array` tiene que ser un filtro aceptado por `Flowsql.prototype._selectMany(table, filters)`. Se explica más en profundidad en ese método.
 * 
 */
function(table, filters) {
  this.trace("_sqlForWhere");
  let sql = "";
  Iterating_filters:
  for (let indexFilter = 0; indexFilter < filters.length; indexFilter++) {
    const filter = filters[indexFilter];
    const [columnId, operator, complement] = filter;
    if (["has", "has not"].indexOf(operator) !== -1) {
      continue Iterating_filters;
    } else if (["=", "!=", "<", "<=", ">", ">="].indexOf(operator) !== -1) {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} ${operator} ${this.constructor.escapeValue(complement)}`;
    } else if (operator === "is null") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} IS NULL`;
    } else if (operator === "is not null") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} IS NOT NULL`;
    } else if (operator === "is like") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} LIKE ${this.constructor.escapeValue(complement)}`;
    } else if (operator === "is not like") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} NOT LIKE ${this.constructor.escapeValue(complement)}`;
    } else if (operator === "is in") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} IN (${complement.map(it => this.constructor.escapeValue(it)).join(",")})`;
    } else if (operator === "is not in") {
      sql += sql === "" ? `\n  WHERE ` : `\n    AND `;
      sql += `${this.constructor.escapeId(columnId)} NOT IN (${complement.map(it => this.constructor.escapeValue(it)).join(",")})`;
    } else {
      throw new Error("Not supported yet operator: " + operator);
    }
  }
  return sql;
};
Flowsql.prototype._sqlForInsertInto = /**
 * 
 * ### `Flowsql.prototype._sqlForInsertInto(table:String, row:Object)`
 * 
 * Método que devuelve el código `sql` correspondiente a `INSERT INTO (...)` dada una tabla y una fila.
 * 
 * Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.
 * 
 */
function(table, row) {
  this.trace("_sqlForInsertInto");
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const nonRelationalColumns = columnIds.filter(columnId => allColumns[columnId].type !== "array-reference");
  let sqlFields = "";
  Iterating_non_relational_columns:
  for(let indexColumn=0; indexColumn<nonRelationalColumns.length; indexColumn++) {
    const columnId = nonRelationalColumns[indexColumn];
    if(!(columnId in row)) {
      continue Iterating_non_relational_columns;
    }
    if(sqlFields.length !== 0) {
      sqlFields += `,`;
    }
    sqlFields += `\n  ${this.constructor.escapeId(columnId)}`;
  }
  let sql = "";
  sql += `INSERT INTO ${this.constructor.escapeId(table)} (${sqlFields}\n)`;
  return sql;
};
Flowsql.prototype._sqlForInsertValues = /**
 * 
 * ### `Flowsql.prototype._sqlForInsertValues(table:String, row:Object)`
 * 
 * Método que devuelve el código `sql` correspondiente a ` VALUES (...)` de un `insert` dada una tabla y una fila.
 * 
 * Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.
 * 
 */
function(table, row) {
  this.trace("_sqlForInsertValues");
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const nonRelationalColumns = columnIds.filter(columnId => allColumns[columnId].type !== "array-reference");
  let sqlFields = "";
  Iterating_non_relational_columns:
  for(let indexColumns=0; indexColumns<nonRelationalColumns.length; indexColumns++) {
    const columnId = nonRelationalColumns[indexColumns];
    if(!(columnId in row)) {
      continue Iterating_non_relational_columns;
    }
    if(sqlFields.length) {
      sqlFields += ",";
    }
    sqlFields += `\n  ${this.constructor.escapeValue(row[columnId])}`;
  }
  let sql = "";
  sql += ` VALUES (${sqlFields}\n);`;
  return sql;
};
Flowsql.prototype._sqlForUpdateSet = /**
 * 
 * ### `Flowsql.prototype._sqlForUpdateSet(table:String, row:Object)`
 * 
 * Método que genera el código `sql` correspondiente a `UPDATE x SET x = y` dada una tabla y una fila.
 * 
 * Se consultarán y omitirán las columnas relacionales especificadas en el `this.$schema.tables[table].columns`.
 * 
 */
function(table, row) {
  this.trace("_sqlForUpdateSet");
  const rowProperties = Object.keys(row);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const relationalColumns = columnIds.filter(columnId => allColumns[columnId].type === "array-reference");
  let sql = "";
  Iterating_row_properties:
  for(let indexProp=0; indexProp<rowProperties.length; indexProp++) {
    const propId = rowProperties[indexProp];
    if(relationalColumns.indexOf(propId) !== -1) {
      continue Iterating_row_properties;
    }
    const propValue = row[propId];
    if(sql !== "") {
      sql += ",";
    }
    sql += `\n    ${this.constructor.escapeId(propId)} = ${this.constructor.escapeValue(propValue)}`;
  }
  return sql;
};
Flowsql.prototype._validateInstance = /**
 * 
 * ### `Flowsql.prototype._validateInstance(table:String, values:Object, operation:String)`
 * 
 * Método que valida una instancia dado el nombre de la tabla y un objeto.
 * 
 * El tercer parámetro sirve para distinguir si está insertando o actualizando un dato, ya que hay algunas diferencias.
 * 
 */
function(table, values, operation) {
  this.trace("_validateInstance");
  this.assertion(["update", "insert"].indexOf(operation) !== -1, `Parameter «operation» must be «insert|update» on «_validateInstance»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const allProperties = Object.keys(values);
  for(let indexProperty=0; indexProperty<allProperties.length; indexProperty++) {
    const propertyId = allProperties[indexProperty];
    this.assertion(columnIds.indexOf(propertyId) !== -1, `Parameter «values[${propertyId}]» does not match with any known column on operation «${operation}» on «_validateInstance»`);
    // @TODO:
    const columnMetadata = allColumns[propertyId];
    const propertyValue = values[propertyId];
    if((typeof propertyValue === "undefined") || (propertyValue === null)) {
      if(columnMetadata.defaultByJs) {
        const defaultFactory = new Function("table", "values", columnMetadata.defaultByJs);
        const defaultOutput = defaultFactory.call(this, table, values);
        values[propertyId] = defaultOutput;
      }
    }
  }
};
Flowsql.prototype._selectMany = /**
 * 
 * ### `Flowsql.prototype._selectMany(table:String, filters:Array, byMethod:String):Array`
 * 
 * Método que selecciona múltiples filas según criterios especificados en `filters:Array`.
 * 
 * Este método interno se usa en todos los métodos CRUD.
 * 
 * Retorna la instancia normal de la tabla, y, adjuntos, los campos que relacionales también.
 * 
 * Por lo cual, no es un `SELECT` simple en sql, sino que son (potencialmente, al menos) varios.
 * 
 * Los `filters:Array` son condiciones conjuntadas por un `AND` lógico.
 * 
 * Los filtros deben seguir la siguiente lógica:
 * 
 * - `filters[n][0]`: la columna contra la que se va a comprobar.
 * - `filters[n][1]`: el operador lógico que se va a usar. Se aceptan los especificados por `Flowsql.knownOperators`, que son:
 *    - `=`
 *    - `!=`
 *    - `<`
 *    - `<=`
 *    - `>`
 *    - `>=`
 *    - `is null`: no acepta complemento comparador
 *    - `is not null`: no acepta complemento comparador
 *    - `is like`: acepta String con `%` como en SQL.
 *    - `is not like`: acepta String con `%` como en SQL.
 *    - `is in`: el complemento comparador debe ser un Array
 *    - `is not in`: el complemento comparador debe ser un Array
 *    - `has`: solo contra columnas relacionales
 *    - `has not`: solo contra columnas relacionales
 * - `filters[n][2]`: el complemento comparador
 * 
 * Devuelve un array con las filas coincidentes.
 * 
 */
function(table, filters, byMethod = "_selectMany") {
  this.trace("_selectMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «${byMethod}»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «${byMethod}»`);
  this._validateFilters(table, filters);
  let mainResults = null;
  Execute_query: {
    let mainQuery = "";
    mainQuery += `SELECT * `;
    mainQuery += `\n  FROM ${this.constructor.escapeId(table)}`;
    let queryFilters = this._sqlForWhere(table, filters);
    mainQuery += queryFilters + ";";
    mainResults = this.fetchSql(mainQuery);
  }
  Expand_relational_columns: {
    if (mainResults.length === 0) {
      break Expand_relational_columns;
    }
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    const mainIds = mainResults.map(row => row.id);
    Inflate_relational_columns:
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = allColumns[columnId];
      if (columnMetadata.type !== "array-reference") {
        continue Inflate_relational_columns;
      }
      const relationalTable = `Rel_x_${table}_x_${columnId}`;
      let relationalQuery = "";
      relationalQuery += `SELECT *`;
      relationalQuery += `\n  FROM ${this.constructor.escapeId(relationalTable)}`;
      relationalQuery += `\n  WHERE id_source IN (\n    ${mainIds.join(",\n    ")}\n  );`;
      const relationalRows = this.fetchSql(relationalQuery);
      for (let indexRows = 0; indexRows < mainResults.length; indexRows++) {
        const resultRow = mainResults[indexRows];
        resultRow[columnId] = relationalRows.filter(row => row.id_source === resultRow.id).sort((a, b) => {
          if (a.sorter > b.sorter) {
            return -1;
          } else if (a.sorter < b.sorter) {
            return 1;
          } else {
            return 0;
          }
        }).map(row => row.id_destination);
      }
    }
  }
  Apply_relational_filters: {
    Iterating_filters:
    for (let indexFilter = 0; indexFilter < filters.length; indexFilter++) {
      const filter = filters[indexFilter];
      const [columnId, operator, comparator] = filter;
      if (["has", "has not"].indexOf(operator) === -1) {
        continue Iterating_filters;
      }
      mainResults = mainResults.filter((row) => {
        const relationalIds = row[columnId];
        let hasIt = false;
        if (Array.isArray(comparator)) {
          hasIt = this.constructor.arrayContainsAnyOf(relationalIds, comparator);
        } else {
          hasIt = relationalIds.indexOf(comparator) !== -1;
        }
        if (operator === "has") {
          return hasIt;
        } else if (operator === "has not") {
          return !hasIt;
        }
      });
    }
  }
  return mainResults;
};
Flowsql.prototype._insertMany = /**
 * 
 * ### `Flowsql.prototype._insertMany(table:String, rows:Array, byMethod:String)`
 * 
 * Método que inserta múltiples filas a la vez.
 * 
 * Este método interno es usado por `Flowsql.prototype.insertOne` y `Flowsql.prototype.insertMany`. De ahí el parámetro `byMethod:String`.
 * 
 * Además de insertar el valor principal, insertará todos los elementos relacionales especificados también.
 * 
 * Devuelve un array con los ids de las filas (principales, no relacionales) insertadas.
 * 
 */
function(table, rows, byMethod = "_insertMany") {
  this.trace("_insertMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a table schema on «${byMethod}»`);
  this.assertion(Array.isArray(rows), `Parameter «rows» must be an array on «${byMethod}»`);
  this.assertion(rows.length > 0, `Parameter «rows» must contain at least 1 item on «${byMethod}»`);
  const mainIds = [];
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const relationalColumns = columnIds.filter(columnId => {
    return allColumns[columnId].type === "array-reference";
  });
  Iterating_rows:
  for (let indexRow = 0; indexRow < rows.length; indexRow++) {
    const row = rows[indexRow];
    this._validateInstance(table, row, "insert");
    let sql = "";
    sql += this._sqlForInsertInto(table, row);
    sql += this._sqlForInsertValues(table, row);
    const insertedId = this.insertSql(sql);
    mainIds.push(insertedId);
    Insert_relational_rows: {
      Iterating_relational_columns:
      for (let indexColumn = 0; indexColumn < relationalColumns.length; indexColumn++) {
        const relationalColumn = relationalColumns[indexColumn];
        if (!(relationalColumn in row)) {
          continue Iterating_relational_columns;
        }
        const relationalTable = `Rel_x_${table}_x_${relationalColumn}`;
        const relationalValues = row[relationalColumn];
        Iterating_relational_values:
        for (let indexValue = 0; indexValue < relationalValues.length; indexValue++) {
          const value = relationalValues[indexValue];
          let relationalSql = ``;
          relationalSql += `INSERT INTO ${this.constructor.escapeId(relationalTable)} (\n  \`id_source\`,\n  \`id_destination\`,\n  \`sorter\`\n)`;
          relationalSql += ` VALUES (`;
          relationalSql += `\n  ${insertedId},`;
          relationalSql += `\n  ${this.constructor.escapeValue(value)},`;
          relationalSql += `\n  1`;
          relationalSql += `\n);`;
          this.insertSql(relationalSql);
        }
      }
    }
  }
  return mainIds;
};
Flowsql.prototype._updateMany = /**
 * 
 * ### `Flowsql.prototype._updateMany(table:String, filters:Array, values:Object, byMethod:String)`
 * 
 * Método que actualiza múltiples filas a la vez.
 * 
 * Al encontrarse con columnas relacionales en `values:Object`, se eliminarán todos los registros relacionales y se volverán a insertar los nuevos especificados en la columna relacional de `values:Object`.
 * 
 * Este método se utiliza por `Flowsql.prototype.updateOne` y `Flowsql.prototype.updateMany`. De ahí el parámetro `byMethod:String`.
 * 
 */
function(table, filters, values, byMethod = "_updateMany") {
  this.trace("_updateMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «${byMethod}»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «${byMethod}»`);
  this.assertion(typeof values === "object", `Parameter «values» must be an object on «${byMethod}»`);
  this._validateInstance(table, values, "update");
  const matchedRows = this._selectMany(table, filters, "updateMany");
  const matchedIds = matchedRows.map(row => row.id);
  const nonRelationalColumns = [];
  Updating_relational_columns: {
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    const relationalColumns = [];
    for (let indexColumn = 0; indexColumn < columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      if (allColumns[columnId].type === "array-reference") {
        relationalColumns.push(columnId);
      } else {
        nonRelationalColumns.push(columnId);
      }
    }
    Iterating_relational_columns:
    for (let indexRelational = 0; indexRelational < relationalColumns.length; indexRelational++) {
      const columnId = relationalColumns[indexRelational];
      if (!(columnId in values)) {
        continue Iterating_relational_columns;
      }
      const relationalTable = `Rel_x_${table}_x_${columnId}`;
      const referredIds = values[columnId];
      let relationalDeleteSql = "";
      relationalDeleteSql += `DELETE FROM ${this.constructor.escapeId(relationalTable)}`;
      relationalDeleteSql += `\n  WHERE id_source IN (${matchedIds.map(id => this.constructor.escapeValue(id)).join(", ")});`;
      this.runSql(relationalDeleteSql);
      for(let indexIds=0; indexIds<matchedIds.length; indexIds++) {
        const matchedId = matchedIds[indexIds];
        for(let indexReferredId=0; indexReferredId<referredIds.length; indexReferredId++) {
          const referredId = referredIds[indexReferredId];
          let relationalInsertSql = "";
          relationalInsertSql += `INSERT INTO ${this.constructor.escapeId(relationalTable)} (\n  id_source,\n  id_destination,\n  sorter\n)`;
          relationalInsertSql += ` VALUES (`;
          relationalInsertSql += `\n  ${this.constructor.escapeValue(matchedId)},`;
          relationalInsertSql += `\n  ${this.constructor.escapeValue(referredId)},`;
          relationalInsertSql += `\n  ${1}`;
          relationalInsertSql += `\n)`;
          this.insertSql(relationalInsertSql);
        }
      }
    }
  }
  const hasNonRelational = this.constructor.arrayContainsAnyOf(Object.keys(values), nonRelationalColumns);
  if (hasNonRelational) {
    let sql = "";
    sql += `UPDATE ${this.constructor.escapeId(table)}`;
    sql += `\n  SET ${this._sqlForUpdateSet(table, values)}`;
    sql += `\n  WHERE id IN (${matchedIds.join(",")})`;
    sql += ";";
    this.runSql(sql);
  }
  return matchedIds;
};
Flowsql.prototype._deleteMany = /**
 * 
 * ### `Flowsql.prototype._deleteMany(table:String, filters:Array, byMethod:String):Array`
 * 
 * Método que elimina múltiples filas a la vez.
 * 
 * Este método interno se usa por `Flowsql.prototype.deleteOne` y `Flowsql.prototype.deleteMany`. De ahí el parámetro `byMethod:String`.
 * 
 * El parámetro `filters:Array` es el mismo que en `Flowsql.prototype._selectMany`, ya que por debajo lo usa.
 * 
 * Devuelve un array con todos los ids eliminados.
 * 
 */
function(table, filters, byMethod = "_deleteMany") {
  this.trace("_deleteMany");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «${byMethod}»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «${byMethod}»`);
  this.assertion(Array.isArray(filters), `Parameter «filters» must be an array on «${byMethod}»`);
  const matchedRows = this._selectMany(table, filters, byMethod);
  const matchedIds = matchedRows.map(row => row.id);
  let sql = "";
  sql += `DELETE FROM ${this.constructor.escapeId(table)}`;
  sql += `\n  WHERE id IN (${matchedIds.join(",")})`;
  sql += ";";
  this.runSql(sql);
  return matchedIds;
};

Flowsql.prototype.assertion = Flowsql.assertion.bind(Flowsql);

Flowsql.prototype.fetchSql = /**
 * 
 * ### `Flowsql.prototype.fetchSql(sql:String):Array`
 * 
 * Método que ejecuta una sentencia sql de tipo `SELECT` y devuelve los registros.
 * 
 * Si `this.$options.traceSql` está en `true` imprimirá el código sql a ejecutar.
 * 
 * Devuelve un array con todos los elementos coincidentes.
 * 
 */
function(sql) {
  this.trace("fetchSql");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  return this.$database.prepare(sql).all();
};
Flowsql.prototype.insertSql = /**
 * 
 * ### `Flowsql.prototype.insertSql(sql:String):Number`
 * 
 * Método que ejecuta un `INSERT` en sql y devuelve el último id insertado.
 * 
 */
function(sql) {
  this.trace("insertSql");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const result = this.$database.prepare(sql).run();
  return result.lastInsertRowid;
};
Flowsql.prototype.runSql = /**
 * 
 * ### `Flowsql.prototype.runSql(sql:String)`
 * 
 * Método que ejecuta un sql, sin devolver nada específico.
 * 
 */
function(sql) {
  this.trace("runSql");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  return this.$database.exec(sql);
};
Flowsql.prototype.connect = /**
 * 
 * ### `Flowsql.prototype.connect()`
 * 
 * Método que crea una instancia de `sqlite3` y actualiza el esquema.
 * 
 * Este método utiliza los siguientes parámetros:
 * 
 * - `this.$options.filename:String` como ruta al fichero `*.sqlite`
 * - `this.$options.databaseOptions:Object` como parámetros para la instancia `sqlite3`
 * 
 * Luego, además, asegura que existen los metadatos básicos en la base de datos con `Flowsql.prototype._ensureBasicMetadata()`.
 * 
 * Luego, además, recarga el esquema propio con el existente en la base de datos, con `Flowsql.prototype._loadSchema()`.
 * 
 */
function() {
  this.trace("connect", [...arguments]);
  this.$database = new this.constructor.dependencies.sqlite3(this.$options.filename, this.$options.databaseOptions);
  this._ensureBasicMetadata();
  this._loadSchema();
  return this;
};
Flowsql.prototype.trace = /**
 * 
 * ### `Flowsql.prototype.trace(method:String, args:Array)`
 * 
 * Método que imprime las trazas de los métodos llamados.
 * 
 * Utiliza el parámetro `this.$options.trace` para saber si debe o no imprimirlos.
 * 
 */
function(method, args = []) {
  if(this.$options.trace) {
    console.log("[trace][flowsql]", method, args.length === 0 ? "" : args.map(arg => typeof arg).join(", "));
  }
};

Flowsql.prototype.extractSqlSchema = /**
 * 
 * ### `Flowsql.prototype.extractSqlSchema():Object`
 * 
 * Método que extrae el esquema del `sql`, no del `this.$schema`.
 * 
 * Esto se ha utilizado solamente con fines de debugging, en el framework no se utiliza, pero puede ser interesante para comprender la estructura `sql` que subyace al esquema.
 * 
 */
function() {
  this.trace("extractSql");
  const schema = { tables: {} };
  // 1. Listar todas las tablas del esquema principal (no las internas de sqlite_)
  const tables = this.$database.prepare(`
    SELECT name 
    FROM sqlite_master 
    WHERE type='table' 
      AND name NOT LIKE 'sqlite_%'
    ORDER BY name
  `).all();
  for (const { name: tableName } of tables) {
    const table = { columns: {}, foreignKeys: [] };
    // 2. Obtener las columnas de la tabla
    const columns = this.$database.prepare(`PRAGMA table_info(${JSON.stringify(tableName)})`).all();
    for (const col of columns) {
      table.columns[col.name] = {
        cid: col.cid,
        name: col.name,
        type: col.type,
        nullable: !col.notnull,
        defaultValue: col.dflt_value,
        primaryKey: !!col.pk
      };
    }
    // 3. Obtener las claves foráneas
    const foreignKeys = this.$database.prepare(`PRAGMA foreign_key_list(${JSON.stringify(tableName)})`).all();
    for (const fk of foreignKeys) {
      table.foreignKeys.push({
        id: fk.id,
        seq: fk.seq,
        column: fk.from,        // columna local
        referredTable: fk.table,      // tabla referida
        referredColumn: fk.to,            // columna remota
        on_update: fk.on_update,
        on_delete: fk.on_delete,
        match: fk.match
      });
    }
    schema.tables[tableName] = table;
  }
  return schema;
};
Flowsql.prototype.validateSchema = /**
 * 
 * ### `Flowsql.prototype.validateSchema(schema:Object)`
 * 
 * Método que comprueba la validez de un esquema.
 * 
 * El parámetro `schema:Object` debe cumplir las validaciones correspondientes.
 * 
 * En este método se comprueba que:
 * 
 * - `schema:Object` es un Object
 * - `schema.tables:Object` es un Object
 * - `schema.tables[table]:Object` es un Object
 * - `schema.tables[table].columns:Object` es un Object
 * - `schema.tables[table].columns[columnId]:Object` es un Object
 * - `schema.tables[table].columns[columnId].type:String` es un String
 * - `schema.tables[table].columns[columnId].type:String` es un tipo conocido por `Flowsql.knownTypes`
 * - `schema.tables[table].columns[columnId].unique:Boolean` es un Boolean o no existe
 * - `schema.tables[table].columns[columnId].nullable:Boolean` es un Boolean o no existe
 * - `schema.tables[table].columns[columnId].label:Boolean` es un Boolean o no existe.
 *    - debe aparecer combinado con `unique:true`
 *    - debe aparecer combinado con `nullable:false` u omitirse especificar `nullable`
 * - `schema.tables[table].columns[columnId].defaultBySql:String` es un String o no existe
 * - `schema.tables[table].columns[columnId].defaultByJs:String` es un String o no existe
 * - `schema.tables[table].columns[columnId].maxLength:Number` es un Number o no existe
 * - Si la columna es un `object-reference` o un `array-reference`:
 *    - `columnMetadata.referredTable` es un String
 *    - `columnMetadata.referredTable` existe en `this.$schema.tables` como identificador de tabla.
 * 
 * Si alguna validación falla, lanza un error especificando el caso de fallo.
 * 
 */
function(schema) {
  this.trace("validateSchema");
  const { assertion } = this;
  assertion(typeof schema === "object", `Parameter «schema» must be an object on «validateSchema»`);
  assertion(typeof schema.tables === "object", `Parameter «schema.tables» must be an object on «validateSchema»`);
  const tableIds = Object.keys(schema.tables);
  for(let indexTable=0; indexTable<tableIds.length; indexTable++) {
    const tableId = tableIds[indexTable];
    const tableMetadata = schema.tables[tableId];
    assertion(typeof tableMetadata === "object", `Parameter «schema.tables[${tableId}]» must be an object on «validateSchema»`);
    assertion(typeof tableMetadata.columns === "object", `Parameter «schema.tables[${tableId}].columns» must be an object on «validateSchema»`);
    let labelColumn = undefined;
    const columnIds = Object.keys(tableMetadata.columns);
    for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = tableMetadata.columns[columnId];
      assertion(typeof columnMetadata === "object", `Parameter «schema.tables[${tableId}].columns[${columnId}]» must be an object on «validateSchema»`);
      assertion(typeof columnMetadata.type === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be an string on «validateSchema»`);
      assertion(this.constructor.knownTypes.indexOf(columnMetadata.type) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].type» must be a known type on «validateSchema»`);
      const isReference = ["object-reference", "array-reference"].indexOf(columnMetadata.type) !== -1;
      if(isReference) {
        assertion(typeof columnMetadata.referredTable === "string", `Parameter «schema.tables[${tableId}].columns[${columnId}].referredTable» must be a string on «validateSchema»`);
        assertion(columnMetadata.referredTable in this.$schema.tables, `Parameter «schema.tables[${tableId}].columns[${columnId}].referredTable» must be a schema table on «validateSchema»`);
      }
      assertion(["undefined", "boolean"].indexOf(typeof columnMetadata.unique) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].unique» must be a boolean or undefined on «validateSchema»`);
      assertion(["undefined", "boolean"].indexOf(typeof columnMetadata.nullable) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].nullable» must be a boolean or undefined on «validateSchema»`);
      assertion(["undefined", "string"].indexOf(typeof columnMetadata.defaultBySql) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].defaultBySql» must be a string or undefined on «validateSchema»`);
      assertion(["undefined", "string"].indexOf(typeof columnMetadata.defaultByJs) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].defaultByJs» must be a string or undefined on «validateSchema»`);
      assertion(["undefined", "number"].indexOf(typeof columnMetadata.maxLength) !== -1, `Parameter «schema.tables[${tableId}].columns[${columnId}].maxLength» must be a number or undefined on «validateSchema»`);
      if(columnMetadata.label) {
        assertion(typeof labelColumn === "undefined", `Parameter «label» is duplicated on table «${tableId}» on «validateSchema»`);
        assertion(columnMetadata.unique, `Parameter «unique» on column «${columnId}» is required to be true on table «${tableId}» if you want it to be considered as label on «validateSchema»`);
        assertion(!columnMetadata.nullable, `Parameter «nullable» on column «${columnId}» is required to be false on table «${tableId}» if you want it to be considered as label on «validateSchema»`);
        labelColumn = columnId;
      }
    }
  }
};
Flowsql.prototype.addTable = /**
 * 
 * ### `Flowsql.prototype.addTable(table:String, partialSchema:Object)`
 * 
 * Método que añade una nueva tabla al esquema sql.
 * 
 * El parámetro `table:String` debe existir en el esquema.
 * 
 * El parámetro `partialSchema:Object` debe cumplir con las validaciones correspondientes a un esquema parcial de tabla.
 * 
 * Además de crear la tabla principal, se crearán las tablas relacionales correspondientes a las columnas relacionales especificadas en `partialSchema:Object`.
 * 
 */
function(table, partialSchema) {
  this.trace("addTable", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «addTable»`);
  this.assertion(typeof partialSchema === "object", `Parameter «partialSchema» must be an object on «addTable»`);
  this.assertion(typeof partialSchema.columns === "object", `Parameter «partialSchema.columns» must be an object on «addTable»`);
  this.assertion(!(table in this.$schema), `Parameter «table» cannot be a schema table on «addTable»`);
  this.validateSchema({tables: {[table]: partialSchema}});
  const relationalColumns = [];
  let sqlForMainTable = "";
  sqlForMainTable += `CREATE TABLE ${this.constructor.escapeId(table)} (`;
  sqlForMainTable += "\n  `id` INTEGER PRIMARY KEY AUTOINCREMENT";
  const columnIds = Object.keys(partialSchema.columns);
  Iterating_all_columns:
  for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
    const columnId = columnIds[indexColumn];
    const columnMetadata = partialSchema.columns[columnId];
    const columnSql = this._sqlForColumn(columnId, columnMetadata);
    if(typeof columnSql === "string") {
      sqlForMainTable += `,\n  ${columnSql}`;
    } else if(typeof columnSql === "object") {
      relationalColumns.push(columnSql.relational);
    } else {
      throw new Error("This error should not have ever arised");
    }
  }
  sqlForMainTable += `\n);`;
  this.runSql(sqlForMainTable);
  Iterating_relational_columns:
  for(let indexColumn=0; indexColumn<relationalColumns.length; indexColumn++) {
    const columnId = relationalColumns[indexColumn];
    const columnMetadata = partialSchema.columns[columnId];
    const referredTable = columnMetadata.referredTable;
    this._createRelationalTable(table, columnId, referredTable);
  }
  this.$schema.tables[table] = partialSchema;
  this._persistSchema();
};
Flowsql.prototype.addColumn = /**
 * 
 * ### `Flowsql.prototype.addColumn(table:String, columnId:String, partialSchema:Object)`
 * 
 * Método que añade una columna al esquema sql.
 * 
 * El parámetro `table:String` debe existir en el esquema.
 * 
 * El parámetro `columnId:String` no debe existir en el esquema de tabla correspondiente.
 * 
 * El parámetro `partialSchema:Object` debe cumplir las validaciones correspondientes a un esquema parcial de columna.
 * 
 * Por dentro, aparte de las validaciones pertinentes, este método:
 * 
 * - Desactiva las foreign keys de la base de datos.
 * - Renombra la tabla original con un nombre temporal.
 * - Crea la misma tabla con el nombre original y la nueva columna.
 * - Inserta todos los registros originales en la nueva tabla.
 * - Elimina la tabla original con nombre temporal.
 * - Activa otra vez las foreign keys.
 * - Crea las tablas relacionales pertinentes.
 * - Cambia el esquema interno (`this.$schema.tables[table]`) con el proporcionado.
 * - Persiste el nuevo esquema en la base de datos
 * 
 * Esto se hace así porque el sql no permite añadir limpiamente una columna con claves foráneas.
 * 
 */
function(table, columnId, partialSchema) {
  this.trace("addColumn", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «addColumn»`);
  this.assertion(typeof columnId === "string", `Parameter «columnId» must be a string on «addColumn»`);
  this.assertion(typeof partialSchema === "object", `Parameter «partialSchema» must be an object on «addColumn»`);
  this.assertion(typeof partialSchema.type === "string", `Parameter «partialSchema.type» must be a string on «addColumn»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «addColumn»`);
  this.assertion(!(columnId in this.$schema), `Parameter «columnId» cannot be a schema column on «addColumn»`);
  this.validateSchema({tables: {[table]: {columns: {[columnId]: partialSchema}}}});
  const tableSchema = this.constructor.copyObject(this.$schema.tables[table]);
  const oldColumns = Object.keys(this.$schema.tables[table].columns).filter(columnId => {
    return this.$schema.tables[table].columns[columnId].type !== "array-reference";
  });
  tableSchema.columns[columnId] = partialSchema;
  let sqlForMainTable = "";
  sqlForMainTable += `CREATE TABLE ${this.constructor.escapeId(table)} (`;
  sqlForMainTable += "\n  `id` INTEGER PRIMARY KEY AUTOINCREMENT";
  const columnIds = Object.keys(tableSchema.columns);
  Iterating_all_columns:
  for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
    const columnId = columnIds[indexColumn];
    const columnMetadata = tableSchema.columns[columnId];
    const columnSql = this._sqlForColumn(columnId, columnMetadata);
    if(typeof columnSql === "string") {
      sqlForMainTable += `,\n  ${columnSql}`;
    } else if(typeof columnSql === "object") {
      // Relational columns can be ignored on addColumn:
      // relationalColumns.push(columnSql.relational);
    } else {
      throw new Error("This error should not have ever arised");
    }
  }
  sqlForMainTable += `\n);`;
  this.runSql("PRAGMA foreign_keys = OFF;");
  this.runSql(`ALTER TABLE ${table} RENAME TO ${table}_tmp;`);
  this.runSql(sqlForMainTable);
  this.runSql(`INSERT INTO ${table} (${oldColumns.join(", ")}) SELECT ${oldColumns.join(", ")} FROM ${table}_tmp;`);
  this.runSql(`DROP TABLE ${table}_tmp;`);
  this.runSql("PRAGMA foreign_keys = ON;");
  const requiresRelationalTable = partialSchema.type === "array-reference";
  if(requiresRelationalTable) {
    this._createRelationalTable(table, columnId, partialSchema.referredTable);
  }
  this.$schema.tables[table] = tableSchema;
  this._persistSchema();
};
Flowsql.prototype.renameTable = /**
 * 
 * ### `Flowsql.prototype.renameTable(table:String, newName:String)`
 * 
 * Método que renombra una tabla del esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `newName:String` no puede ser una tabla del esquema.
 * 
 * Hará un `ALTER TABLE x RENAME TO y` a nivel de sql y cambiará y persistirá los cambios del esquema del `this.$schema`.
 * 
 */
function(table, newName) {
  this.trace("renameTable", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «renameTable»`);
  this.assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameTable»`);
  this.runSql(`ALTER TABLE ${this.constructor.escapeId(table)} RENAME TO ${this.constructor.escapeId(newName)}`);
  this.$schema.tables[newName] = this.constructor.copyObject(this.$schema.tables[table]);
  delete this.$schema.tables[table];
  this._persistSchema();
};
Flowsql.prototype.renameColumn = /**
 * 
 * ### `Flowsql.prototype.renameColumn(table:String, columnId:String, newName:String)`
 * 
 * Método que renombra una columna del esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `columnId:String` debe ser una columna del esquema de la tabla.
 * 
 * El parámetro `newName:String` no puede ser una columna del esquema de la tabla.
 * 
 */
function(table, columnId, newName) {
  this.trace("renameColumn", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «renameTable»`);
  this.assertion(typeof columnId === "string", `Parameter «columnId» must be a string on «renameTable»`);
  this.assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameTable»`);
  this.runSql(`ALTER TABLE ${table} RENAME COLUMN ${columnId} TO ${newName};`);
  this.$schema.tables[table].columns[newName] = this.constructor.copyObject(this.$schema.tables[table].columns[columnId]);
  delete this.$schema.tables[table].columns[columnId];
  this._persistSchema();
  // @TODO...
};
Flowsql.prototype.dropTable = /**
 * 
 * ### `Flowsql.prototype.dropTable(table:String)`
 * 
 * Método que elimina una tabla del esquema.
 * 
 * El parámetro `table:String` debe existir como tabla en el `this.$schema.tables`.
 * 
 * Si encuentra columnas relacionales dentro de la tabla, eliminará todas las tablas relacionales.
 * 
 */
function(table) {
  this.trace("dropTable", [...arguments]);
  Eliminar_tablas_relacionales: {
    const allColumns = this.$schema.tables[table].columns;
    const columnIds = Object.keys(allColumns);
    for(let indexColumn=0; indexColumn<columnIds.length; indexColumn++) {
      const columnId = columnIds[indexColumn];
      const columnMetadata = this.$schema.tables[table].columns[columnId];
      const isRelationalColumn = columnMetadata.type === "array-reference";
      if(isRelationalColumn) {
        const relationalTable = `Rel_x_${table}_x_${columnId}`;
        this.runSql(`DROP TABLE ${this.constructor.escapeId(relationalTable)};`);
      }
    }
  }
  this.runSql(`DROP TABLE ${this.constructor.escapeId(table)};`);
  delete this.$schema.tables[table];
};
Flowsql.prototype.dropColumn = /**
 * 
 * ### `Flowsql.prototype.dropColumn(table:String, columnId:String)`
 * 
 * Método que elimina una columna de una tabla.
 * 
 * El parámetro `table:String` debe existir como tabla en el esquema de `this.$schema.tables`.
 * 
 * El parámetro `columnId:String` debe existir como columna en el esquema de `this.$schema.tables[table].columns`.
 * 
 * Si la columna es relacional, eliminará la tabla relacional entera.
 * 
 */
function(table, columnId) {
  this.trace("dropColumn", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «dropColumn»`);
  this.assertion(typeof columnId === "string", `Parameter «columnId» must be a string on «dropColumn»`);
  this.assertion(typeof this.$schema.tables[table] === "object", `Parameter «table» must be a schema table on «dropColumn»`);
  this.assertion(typeof this.$schema.tables[table].columns[columnId] === "object", `Parameter «columnId» must be a schema column on «dropColumn»`);
  const isRelationalColumn = this.$schema.tables[table].columns[columnId].type === "array-reference";
  if(isRelationalColumn) {
    const relationalTable = `Rel_x_${table}_x_${columnId}`;
    this.runSql(`DROP TABLE ${this.constructor.escapeId(relationalTable)};`);
  } else {
    this.runSql(`ALTER TABLE ${this.constructor.escapeId(table)} DROP COLUMN ${this.constructor.escapeId(columnId)};`);
  }
  delete this.$schema.tables[table].columns[columnId];
  this._persistSchema();
};

Flowsql.prototype.insertOne = /**
 * 
 * ### `Flowsql.prototype.insertOne(table:String, item:Object):Number`
 * 
 * Método que inserta una fila.
 * 
 * Por debajo llama a `Flowsql.prototype._insertMany` pasándole `item:Object` dentro de un array, de 1 solo ítem.
 * 
 * Devuelve el identificador de la nueva fila recién insertada.
 * 
 */
function(table, item) {
  this.trace("insertOne");
  const insertedIds = this._insertMany(table, [item], "insertOne");
  return insertedIds[0];
};
Flowsql.prototype.insertMany = /**
 * 
 * ### `Flowsql.prototype.insertMany(table:String, rows:Array):Array<Number>`
 * 
 * Método que inserta múltiples filas de golpe.
 * 
 * Por debajo llamara a `Flowsql.prototype._insertMany`.
 * 
 * Devuelve un array con todos los ítems insertados.
 * 
 */
function(table, rows) {
  this.trace("insertMany");
  this.assertion(typeof table === "string", "Parameter «table» must be a string on «insertMany»");
  this.assertion(Array.isArray(rows), "Parameter «rows» must be an array on «insertMany»");
  return this._insertMany(table, rows, "insertMany");
};
Flowsql.prototype.selectOne = /**
 * 
 * ### `Flowsql.prototype.selectOne(table:String, id:String|Number):Object`
 * 
 * Método que selecciona una fila de una tabla basándose en su id.
 * 
 * Por debajo, usa `Flowsql.prototype._selectMany`.
 * 
 */
function(table, id) {
  this.trace("selectOne");
  const allMatches = this._selectMany(table, [["id", "=", id]], "selectOne");
  return allMatches[0] || null;
};
Flowsql.prototype.selectMany = /**
 * 
 * ### `Flowsql.prototype.selectMany(table:String, filters:Array):Array`
 * 
 * Método que selecciona múltiples filas de una tabla.
 * 
 * Por debajo, usa `Flowsql.prototype._selectMany`.
 * 
 */
function(table, filters = []) {
  this.trace("selectMany");
  return this._selectMany(table, filters, "selectMany");
};
Flowsql.prototype.selectByLabel = /**
 * 
 * ### `Flowsql.prototype.selectByLabel(table:String, label:String)`
 * 
 * Este método permite seleccionar una fila de una tabla basándose en la columna que tiene `label: true` en el esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `label:String` será el valor que tiene que tener la fila en la columna en la cual, en el esquema, tenga la propiedad `label` en `true`.
 * 
 */
function(table, label) {
  this.trace("selectByLabel");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «selectByLabel»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «selectByLabel»`);
  this.assertion(typeof label === "string", `Parameter «label» must be a string on «selectByLabel»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const labelColumns = columnIds.filter(columnId => allColumns[columnId].label === true);
  this.assertion(labelColumns.length === 1, `Parameter «label» cannot be applied because table «${table}» has not a column as «label» on «selectByLabel»`);
  const labelColumn = labelColumns[0];
  const matchedRows = this._selectMany(table, [[labelColumn, "=", label]], "selectByLabel");
  return matchedRows[0] || null;
};
Flowsql.prototype.updateOne = /**
 * 
 * ### `Flowsql.prototype.updateOne(table:String, id:String|Number, values:Object)`
 * 
 * Método que actualiza una fila basándose en su id.
 * 
 * Por debajo utiliza `Flowsql.prototype._updateMany`.
 * 
 */
function(table, id, values) {
  this.trace("updateOne");
  const modifiedIds = this._updateMany(table, [["id", "=", id]], values, "updateOne");
  return modifiedIds[0];
};
Flowsql.prototype.updateMany = /**
 * 
 * ### `Flowsql.prototype.updateMany(table:String, filters:Array, values:Object)`
 * 
 * Método que actualiza varias filas de golpe.
 * 
 * Por debajo utiliza `Flowsql.prototype._updateMany`.
 * 
 */
function(table, filters, values) {
  this.trace("updateMany");
  this.assertion(typeof table === "string", "Parameter «table» must be a string on «updateMany»");
  this.assertion((typeof filters === "undefined") || Array.isArray(filters), "Parameter «filters» must be an array on «updateMany»");
  this.assertion(typeof values === "object", "Parameter «values» must be an object on «updateMany»");
  return this._updateMany(table, filters, values, "updateMany");
};
Flowsql.prototype.updateByLabel = /**
 * 
 * ### `Flowsql.prototype.updateByLabel(table:String, label:String, values:Object)`
 * 
 * Método que actualiza una fila basándose en su columna `label:true`.
 * 
 * 
 * 
 */
function(table, label, values) {
  this.trace("updateByLabel");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «updateByLabel»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «updateByLabel»`);
  this.assertion(typeof label === "string", `Parameter «label» must be a string on «updateByLabel»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const labelColumns = columnIds.filter(columnId => allColumns[columnId].label === true);
  this.assertion(labelColumns.length === 1, `Parameter «label» cannot be applied because table «${table}» has not a column as «label» on «updateByLabel»`);
  const labelColumn = labelColumns[0];
  const modifiedIds = this._updateMany(table, [[labelColumn, "=", label]], values, "updateByLabel");
  return modifiedIds[0];
};
Flowsql.prototype.deleteOne = /**
 * 
 * ### `Flowsql.prototype.deleteOne(table:String, id:String|Number):Number`
 * 
 * Método que elimina 1 fila basándose en su campo `id`.
 * 
 * Este método llama a `Flowsql.prototype._deleteMany` por debajo.
 * 
 * Devuelve el id de la fila eliminada.
 * 
 */
function(table, id) {
  this.trace("deleteOne");
  return this._deleteMany(table, [["id", "=", id]], "deleteOne");
};
Flowsql.prototype.deleteMany = /**
 * 
 * ### `Flowsql.prototype.deleteMany(table:String, filters:Array):Array`
 * 
 * Método que elimina varias filas de golpe.
 * 
 * Este método llama a `Flowsql.prototype._deleteMany` por debajo.
 * 
 * Devuelve los ids de las filas eliminadas.
 * 
 */
function(table, filters) {
  this.trace("deleteMany");
  return this._deleteMany(table, filters, "deleteMany");
};
Flowsql.prototype.deleteByLabel = /**
 * 
 * ### `Flowsql.prototype.deleteByLabel(table:String, label:String):Array`
 * 
 * Método que elimina una fila de una tabla basándose en su columna `label:true`.
 * 
 */
function(table, label) {
  this.trace("deleteByLabel");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «deleteByLabel»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «deleteByLabel»`);
  this.assertion(typeof label === "string", `Parameter «label» must be a string on «deleteByLabel»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const labelColumns = columnIds.filter(columnId => allColumns[columnId].label === true);
  this.assertion(labelColumns.length === 1, `Parameter «label» cannot be applied because table «${table}» has not a column as «label» on «deleteByLabel»`);
  const labelColumn = labelColumns[0];
  return this._deleteMany(table, [[labelColumn, "=", label]], "deleteByLabel");
};

module.exports = Flowsql;