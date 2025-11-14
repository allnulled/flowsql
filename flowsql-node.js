

const FlowsqlNodejs = /**
 * 
 * ## Node.js API de Flowsql
 * 
 * La `Node.js API de Flowsql` es la API que se carga en entorno de node.js.
 * 
 * Aquí se explican los métodos que esta API tiene, y que son la base para la `Browser API de Flowsql` también.
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

FlowsqlNodejs.create = /**
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
FlowsqlNodejs.assertion = /**
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
FlowsqlNodejs.AssertionError = /**
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
FlowsqlNodejs.defaultOptions = /**
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
FlowsqlNodejs.defaultDatabaseOptions = /**
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
FlowsqlNodejs.dependencies = /**
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
FlowsqlNodejs.escapeId = /**
 * 
 * ### `Flowsql.escapeId(value:any)`
 * 
 * Método que sirve para escapar identificadores en la sintaxis sql.
 * 
 */
function(value) {
  return "`" + value.replace(/`/g, "") + "`";
};
FlowsqlNodejs.escapeValue = /**
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
FlowsqlNodejs.getSqlType = /**
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
FlowsqlNodejs.knownTypes = /**
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
FlowsqlNodejs.knownOperators = /**
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
FlowsqlNodejs.copyObject = /**
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
FlowsqlNodejs.arrayContainsAnyOf = /**
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

FlowsqlNodejs.prototype._ensureBasicMetadata = /**
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
  Ensure_database_metadata: {
    this.runSql(`
      CREATE TABLE IF NOT EXISTS \`Database_metadata\` (
        \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
        \`name\` VARCHAR(255) UNIQUE NOT NULL,
        \`value\` TEXT
      );
    `);
    const schemaQuery = this.fetchSql(`
      SELECT *
      FROM \`Database_metadata\`
      WHERE \`name\` = 'db.schema';
    `);
    if (schemaQuery.length !== 0) {
      break Ensure_database_metadata;
    }
    const defaultSchema = this.constructor.escapeValue(JSON.stringify({
      tables: {
        Database_metadata: {},
        Database_files: {
          columns: {
            node_path: {type: "string"},
            node_type: {type: "string"},
            node_content: {type: "string"},
          }
        },
      }
    }));
    this.runSql(`
      INSERT INTO \`Database_metadata\` (\`name\`, \`value\`)
      VALUES ('db.schema', ${defaultSchema});
    `);
  }
  Ensure_database_files: {
    this.runSql(`
      CREATE TABLE IF NOT EXISTS \`Database_files\` (
        \`id\` INTEGER PRIMARY KEY AUTOINCREMENT,
        \`node_path\` VARCHAR(1000),
        \`node_type\` VARCHAR(50),
        \`node_content\` TEXT,
        \`node_parent\` INTEGER REFERENCES \`Database_files\` (\`id\`)
      );
    `)
  }
};
FlowsqlNodejs.prototype._loadSchema = /**
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
FlowsqlNodejs.prototype._persistSchema = /**
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
FlowsqlNodejs.prototype._createRelationalTable = /**
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
FlowsqlNodejs.prototype._validateFilters = /**
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
      if(columnType === "array") {
        // @OK.
      } else {
        this.assertion(columnType === "array-reference", `Parameter «filters[${indexFilter}]» is filtering by «has|has not» on a column that is not type «array-reference» on «selectMany»`);
        this.assertion((typeof complement === "number") || Array.isArray(complement), `Parameter «filters[${indexFilter}][2]» must be a number or an array on «has|has not» filter on «selectMany»`);
      }
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
FlowsqlNodejs.prototype._sqlForColumn = /**
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
FlowsqlNodejs.prototype._sqlForWhere = /**
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
FlowsqlNodejs.prototype._sqlForInsertInto = /**
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
FlowsqlNodejs.prototype._sqlForInsertValues = /**
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
    const columnMetadata = allColumns[columnId];
    if(columnMetadata.type === "array") {
      sqlFields += `\n  ${this.constructor.escapeValue(JSON.stringify(row[columnId]))}`;
    } else {
      sqlFields += `\n  ${this.constructor.escapeValue(row[columnId])}`;
    }
  }
  let sql = "";
  sql += ` VALUES (${sqlFields}\n);`;
  return sql;
};
FlowsqlNodejs.prototype._sqlForUpdateSet = /**
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
FlowsqlNodejs.prototype._validateInstance = /**
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
FlowsqlNodejs.prototype._selectMany = /**
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
  Expand_json_columns: {
    const jsonColumns = Object.keys(this.$schema.tables[table].columns).filter(columnId => {
      return this.$schema.tables[table].columns[columnId].tag === true;
    });
    for(let indexColumn=0; indexColumn<jsonColumns.length; indexColumn++) {
      const jsonColumn = jsonColumns[indexColumn];
      for(let indexRow=0; indexRow<mainResults.length; indexRow++) {
        const row = mainResults[indexRow];
        try {
          row[jsonColumn] = JSON.parse(row[jsonColumn]);
        } catch (error) {
          console.log(`Error parsing as JSON column «${jsonColumn}» on row «${indexRow}» on «_selectMany»`);
        }
      }
    }
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
FlowsqlNodejs.prototype._insertMany = /**
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
FlowsqlNodejs.prototype._updateMany = /**
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
FlowsqlNodejs.prototype._deleteMany = /**
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

FlowsqlNodejs.prototype.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);

FlowsqlNodejs.prototype.fetchSql = /**
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
FlowsqlNodejs.prototype.insertSql = /**
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
FlowsqlNodejs.prototype.runSql = /**
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
FlowsqlNodejs.prototype.connect = /**
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
FlowsqlNodejs.prototype.trace = /**
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

FlowsqlNodejs.prototype.extractSqlSchema = /**
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
FlowsqlNodejs.prototype.validateSchema = /**
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
FlowsqlNodejs.prototype.addTable = /**
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
FlowsqlNodejs.prototype.addColumn = /**
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
FlowsqlNodejs.prototype.renameTable = /**
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
FlowsqlNodejs.prototype.renameColumn = /**
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
FlowsqlNodejs.prototype.dropTable = /**
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
FlowsqlNodejs.prototype.dropColumn = /**
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

FlowsqlNodejs.prototype.insertOne = /**
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
FlowsqlNodejs.prototype.insertMany = /**
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
FlowsqlNodejs.prototype.selectOne = /**
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
FlowsqlNodejs.prototype.selectMany = /**
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
FlowsqlNodejs.prototype.selectByLabel = /**
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
FlowsqlNodejs.prototype.selectByTags = /**
 * 
 * ### `Flowsql.prototype.selectByTags(table:String, label:String)`
 * 
 * Este método permite seleccionar una fila de una tabla basándose en la columna que tiene `label: true` en el esquema.
 * 
 * El parámetro `table:String` debe ser una tabla del esquema.
 * 
 * El parámetro `label:String` será el valor que tiene que tener la fila en la columna en la cual, en el esquema, tenga la propiedad `label` en `true`.
 * 
 */
function(table, tags) {
  this.trace("selectByTags");
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «selectByTags»`);
  this.assertion(table in this.$schema.tables, `Parameter «table» must be a schema table on «selectByTags»`);
  this.assertion(Array.isArray(tags), `Parameter «tags» must be an array on «selectByTags»`);
  const allColumns = this.$schema.tables[table].columns;
  const columnIds = Object.keys(allColumns);
  const tagColumns = columnIds.filter(columnId => allColumns[columnId].tag === true);
  this.assertion(tagColumns.length !== 0, `Parameter «tag» cannot be applied because table «${table}» has not any column as «tag» on «selectByTags»`);
  let allMatches = [];
  for(let indexTag=0; indexTag<tagColumns.length; indexTag++) {
    const tagColumn = tagColumns[indexTag];
    const matchedRows = this._selectMany(table, [[tagColumn, "has", tags]], "selectByTags");
    allMatches = allMatches.concat(matchedRows);
  }
  return allMatches || null;
};
FlowsqlNodejs.prototype.updateOne = /**
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
FlowsqlNodejs.prototype.updateMany = /**
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
FlowsqlNodejs.prototype.updateByLabel = /**
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
FlowsqlNodejs.prototype.deleteOne = /**
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
FlowsqlNodejs.prototype.deleteMany = /**
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
FlowsqlNodejs.prototype.deleteByLabel = /**
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


    Include_data_proxy_api: {
        FlowsqlNodejs.prototype.createDataProxy = /**
 * 
 * ### `Flowsql.prototype.createDataProxy(dataset:Array, memory:Object):FlowsqlDataProxy`
 * 
 * Método que construye un `DataProxy`.
 * 
 * Consulta la interfaz de `DataProxy` para más información.
 * 
 */
function(dataset, memory) {
  return new this.constructor.DataProxy(dataset, this, memory);
};
        FlowsqlNodejs.DataProxy = /**
 * 
 * ## Data Proxy API de Flowsql
 * 
 * La `Data Proxy API de Flowsql` sirve para gestionar subconjuntos de datos de forma independiente.
 * 
 * Hay un vínculo débil con la base de datos, que puede usarse como complemento, aunque algunos métodos dependen de el parámetro «database» ser seguro.
 * 
 * La `Data Proxy API` es útil para iterar sobre 1 conjunto de datos muchas veces.
 * 
 * ### `new Flowsql.DataProxy(dataset:Array, database:Flowsql|FlowsqlBrowser)`
 * 
 * Método para crear un data proxy de flowsql. 
 * 
 * Los data proxy permiten iterar sobre un conjunto de datos mediante method chaining o procesar matrices de operaciones, entre otras.
 * 
 * Los data proxy pueden necesitar acceso a la base de datos, por lo cual se pide como segundo parámetro `database:Flowsql|FlowsqlBrowser`.
 * 
 */
function(dataset, database, memory = {}) {
  this.constructor.assertion(Array.isArray(dataset), "Parameter «dataset» must be an array on «DataProxy»");
  this.constructor.assertion(typeof database === "object", "Parameter «database» must be an object on «DataProxy»");
  this.constructor.assertion(database instanceof this.constructor.Flowsql, "Parameter «database» must be a child of «DataProxy.Flowsql» on «DataProxy»");
  this.constructor.assertion(typeof memory === "object", "Parameter «memory» must be an object on «DataProxy»");
  this.$database = database;
  this.$dataset = dataset;
  this.$memory = memory;
  return this;
};
        FlowsqlNodejs.DataProxy.Flowsql = FlowsqlNodejs;
        
        FlowsqlNodejs.DataProxy.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.DataProxy.prototype.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.DataProxy.prototype.mapByEval = /**
 * 
 * ### `async DataProxy.prototype.mapByEval(code:String):Promise<DataProxy>`
 * 
 * Método para hacer mapeos asíncronos por evaluación de código en texto.
 * 
 */
async function() {

};
        FlowsqlNodejs.DataProxy.prototype.filterByEval = /**
 * 
 * ### `async DataProxy.prototype.filterByEval(code:String):Promise<DataProxy»`
 * 
 * Método para...
 * 
 */
async function() {

};
        FlowsqlNodejs.DataProxy.prototype.reduceByEval = /**
 * 
 * ### `async DataProxy.reduceByEval(code:String):Promise<DataProxy»`
 * 
 * Método para reducir como con `Array.prototype.reduce` pero asíncronamente y mediante un string de código js.
 * 
 * El método seguirá devolviendo un array, pero lo puedes decorar a placer.
 * 
 */
async function() {

};
        FlowsqlNodejs.DataProxy.prototype.modifyByEval = /**
 * 
 * ### `async DataProxy.prototype.modifyByEval():Promise<DataProxy»`
 * 
 * Método para...
 * 
 */
async function() {

};
        FlowsqlNodejs.DataProxy.prototype.amplifyByEval = /**
 * 
 * ### `async DataProxy.prototype.amplifyByEval(code:String):Promise<DataProxy»`
 * 
 * Método para...
 * 
 */
async function() {

};
        
        FlowsqlNodejs.DataProxy.prototype.groupByEvals = 
        
        FlowsqlNodejs.DataProxy.prototype.accessProperty = /**
 * 
 * ### `async DataProxy.accessProperty(name:String):Promise<DataProxy»`
 * 
 * Método para cambiar el `$dataset` a una propiedad interna.
 * 
 * Si la 
 * 
 */
async function(name) {
  if(Array.isArray(this.$dataset)) {
    const output = [];
    for(let indexRow=0; indexRow<this.$dataset.length; indexRow++) {
      const row = this.$dataset[indexRow];
      const value = row[name];
      if(Array.isArray(value)) {
        for(let indexItem=0; indexItem<value.length; indexItem++) {
          const item = value[indexItem];
          output.push(item);
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  return this.$dataset[name];
};
        FlowsqlNodejs.DataProxy.prototype.memorize = /**
 * 
 * ### `DataProxy.prototype.memorize(keys:Object):DataProxy`
 * 
 */
function(keys) {
  this.constructor.assertion(typeof keys === "object", "Parameter «keys» must be an object on «DataProxy.memorize»");
  return this;
};
        FlowsqlNodejs.DataProxy.prototype.remember = /**
 * 
 * ### `DataProxy.prototype.remember(keys:Object):any`
 * 
 */
function(id) {
  
};
        FlowsqlNodejs.DataProxy.prototype.deduplicate = /**
 * 
 * ### `DataProxy.prototype.setMemory(keys:Object):DataProxy`
 * 
 */
function(keys) {
  this.constructor.assertion(typeof keys === "object", "Parameter «keys» must be an object on «DataProxy.setMemory»");
  return this;
};
        FlowsqlNodejs.DataProxy.prototype.byMatrix = /**
 * 
 * ### `DataProxy.prototype.byMatrix(matrix:Array):DataProxy`
 * 
 */
function(matrix) {
  this.constructor.Flowsql.assertion(Array.isArray(matrix), "Parameter «matrix» must be an array on «DataProxy.byMatrix»");
  return this;
};
    }

    Include_file_system_api: {
        FlowsqlNodejs.prototype.createFileSystem = /**
 * 
 * ### `Flowsql.prototype.createFileSystem(table:String, options:Object):FlowsqlFileSystem`
 * 
 * Método que construye un `FileSystem`.
 * 
 * Consulta la interfaz de `FileSystem` para más información.
 * 
 */
function(table, options) {
  return new this.constructor.FileSystem(table, this, options);
};
        
        FlowsqlNodejs.FileSystem = /**
 * 
 * ## FileSystem API de Flowsql
 * 
 * La `FileSystem API de Flowsql` permite crear una interfaz programática para interactuar con un sistema de ficheros basándose en una tabla de la base de datos.
 * 
 * La tabla debe cumplir con unos requisitos en el `$schema`.
 * 
 * ### `new FlowsqlFileSystem(database:Flowsql, table:String, options:Object): FlowsqlFileSystem`
 * 
 * Método constructor.
 * 
 */
function(table, flowsql, options = {}) {
  this.constructor.assertion(typeof table === "string", `Parameter «table» must be a string on «FlowsqlFileSystem.constructor»`);
  this.constructor.assertion(typeof flowsql === "object", `Parameter «flowsql» must be a object on «FlowsqlFileSystem.constructor»`);
  this.constructor.assertion(typeof options === "object", `Parameter «options» must be a object on «FlowsqlFileSystem.constructor»`);
  this.constructor.assertion(table in flowsql.$schema.tables, `Parameter «table» must be a table in the schema on «FlowsqlFileSystem.constructor»`);
  this.$table = table;
  this.$flowsql = flowsql;
  this.$options = Object.assign({}, this.constructor.defaultOptions, options);
  return this;
};
        FlowsqlNodejs.FileSystem.Flowsql = FlowsqlNodejs;
        FlowsqlNodejs.FileSystem.AssertionError = FlowsqlNodejs.AssertionError.bind(FlowsqlNodejs);
        FlowsqlNodejs.FileSystem.defaultOptions = /**
 * 
 * ### `FlowsqlFilesystem.defaultOptions:Object`
 * 
 * Objeto con las columnas especiales de la tabla.
 * 
 * Puede customizarse pero lo recomendable es que no, ya que hay 1 por tabla, así que no haría falta tocar nada si se respetan los nombres y tipos.
 * 
 * Concretamente, tiene esto:
 * 
 * ```js
 * {
 *   columnForName: "node_name",
 *   columnForType: "node_type",
 *   columnForContent: "node_content",
 *   columnForParent: "node_parent",
 * };
 * ```
 * 
 */
{
  columnForPath: "node_path",
  columnForType: "node_type",
  columnForContent: "node_content",
};
        FlowsqlNodejs.FileSystem.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.FileSystem.normalizePath = /**
 * 
 * ### `FlowsqlFilesystem.normalizePath(...pathParts:Array<String>):String`
 * 
 * Método que construye una ruta a partir de sus fragmentos con `...pathParts:Array<String>`.
 * 
 * Retorna la ruta formada en formato `String`.
 *  
 */
function(...subpaths) {
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
        
        FlowsqlNodejs.FileSystem.prototype.assertion = FlowsqlNodejs.prototype.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.FileSystem.prototype._decomposePath = /**
 * 
 * ### `FlowsqlFileSystem.prototype._decomposePath(filepath:String, splitter:String = "/"):Array<String>`
 *  
 * Método que descompone en partes un path según el `splitter:String` que por defecto es el caracter "/".
 * 
 */
function(filepath, splitter = "/") {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «_decomposePath»`);
  this.assertion(typeof splitter === "string", `Parameter «splitter» must be a string on «_decomposePath»`);
  const fileparts = filepath.split(splitter);
  return fileparts.filter(part => (typeof part === "undefined" ? "" : part).trim() !== "");
}
        FlowsqlNodejs.FileSystem.prototype._copyObject = /**
 * 
 * ### `FlowsqlFileSystem.prototype._copyObject(obj:Object):Array<String>`
 *  
 * Método que copia un objeto usando JSON.stringify + JSON.parse.
 * 
 */
function(obj) {
  this.assertion(typeof obj === "object", `Parameter «obj» must be a object on «_copyObject»`);
  return JSON.parse(JSON.stringify(obj));
}
        FlowsqlNodejs.FileSystem.prototype.findByPath = /**
 * 
 * ### `FlowsqlFileSystem.prototype.findByPath(filepath:String):Object`
 *  
 * Método que encuentra un nodo según su ruta.
 * 
 */
function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «findByPath»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", filepath]
  ]);
  return matched[0] || null;
}
        FlowsqlNodejs.FileSystem.prototype.readFile = /**
 * 
 * ### `FlowsqlFileSystem.prototype.readFile(filepath:String)`
 * 
 * Método para leer un fichero basándose en una ruta.
 * 
 */
function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.readFile»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", this.constructor.normalizePath(filepath)]
  ]);
  if(matched.length === 1) {
    return matched[0][this.$options.columnForContent];
  }
  return undefined;
};
        FlowsqlNodejs.FileSystem.prototype.readDirectory = /**
 * 
 * ### `FlowsqlFileSystem.prototype.readDirectory(dirpath:String)`
 * 
 * Método para leer un directorio basándose en una ruta.
 * 
 */
function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.readDirectory»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "is like", this.constructor.normalizePath(dirpath, "%")]
  ]);
  const immediateMatched = matched.filter(row => {
    const nodePath = row[this.$options.columnForPath];
    const dirSubpath = (dirpath + "/").replace(/\/\/+/g, "/");
    const isDirSubpath = nodePath.startsWith(dirSubpath);
    if(!isDirSubpath) {
      return false;
    }
    const slashMatches = nodePath.replace(dirSubpath, "").match(/\//g);
    const isImmediateChild = slashMatches === null;
    return isImmediateChild;
  });
  return immediateMatched;
};
        FlowsqlNodejs.FileSystem.prototype.writeFile = /**
 * 
 * ### `FlowsqlFileSystem.prototype.writeFile(filepath:String, content:String)`
 * 
 * Método para escribir en un fichero basándose en una ruta.
 * 
 */
function(filepath, content) {
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
        FlowsqlNodejs.FileSystem.prototype.writeDirectory = /**
 * 
 * ### `FlowsqlFileSystem.prototype.writeDirectory(dirpath:String)`
 * 
 * Método para crear un directorio basándose en una ruta.
 * 
 */
function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.prototype.writeDirectory»`);
  let output = "";
  const node = this.findByPath(dirpath);
  if(node === null) {
    const normalizedDirpath = this.constructor.normalizePath(dirpath);
    output = this.$flowsql.insertOne(this.$table, {
      [this.$options.columnForPath]: normalizedDirpath,
      [this.$options.columnForType]: "directory",
      [this.$options.columnForContent]: "",
    });
  } else {
    throw new Error("Cannot create directory because it already exists on «FlowsqlFileSystem.prototype.writeDirectory»");
  }
  return output;
};
        FlowsqlNodejs.FileSystem.prototype.removeFile = /**
 * 
 * ### `FlowsqlFileSystem.prototype.removeFile(filepath:String)`
 * 
 * Método para eliminar un fichero basándose en una ruta.
 * 
 */
function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.removeFile»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", this.constructor.normalizePath(filepath)]
  ]);
  if(matched.length === 0) {
    throw new Error(`Cannot remove file because no file was found by «${filepath}» on «FlowsqlFileSystem.prototype.removeFile»`);
  } else if(matched.length !== 1) {
    throw new Error(`Cannot remove file because multiple files with the same path. This error should not happen and it means that your schema is not defining 'unique:true' on the «${this.$options.columnForPath}» column of the «filesystem» table «${this.$table}» arised on «FlowsqlFileSystem.prototype.removeFile»`)
  }
  const row = matched[0];
  if(row[this.$options.columnForType] !== "file") {
    throw new Error(`Cannot remove file because the node is not a file on «${row[this.$options.columnForPath]}» on «FlowsqlFileSystem.prototype.removeFile»`);
  }
  return this.$flowsql.deleteOne(this.$table, row.id);
};
        FlowsqlNodejs.FileSystem.prototype.removeDirectory = /**
 * 
 * ### `FlowsqlFileSystem.prototype.removeDirectory(directory:String, options:Object)`
 * 
 * Método para eliminar un directorio basándose en una ruta.
 * 
 * Puede usarse, en `options:Object`, el flag `recursive:true` para eliminar recursivamente.
 * 
 */
function(dirpath, options = {}) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.removeDirectory»`);
  this.assertion(typeof options === "object", `Parameter «options» must be an object on «FlowsqlFileSystem.removeDirectory»`);
  const matched = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", this.constructor.normalizePath(dirpath)]
  ]);
  if(matched.length === 0) {
    throw new Error(`Cannot remove directory because no directory was found by «${dirpath}» on «FlowsqlFileSystem.prototype.removeDirectory»`);
  } else if(matched.length !== 1) {
    throw new Error(`Cannot remove directory because multiple nodes with the same path. This error should not happen and it means that your schema is not defining 'unique:true' on the «${this.$options.columnForPath}» column of the «filesystem» table «${this.$table}» arised on «FlowsqlFileSystem.prototype.removeDirectory»`)
  }
  const row = matched[0];
  if(row[this.$options.columnForType] !== "directory") {
    throw new Error(`Cannot remove directory because it is not a directory on «${row[this.$options.columnForPath]}» on «FlowsqlFileSystem.prototype.removeDirectory»`);
  }
  const isRecursive = options.recursive === true;
  if(!isRecursive) {
    return this.$flowsql.deleteOne(this.$table, row.id);
  } else {
    return this.$flowsql.deleteMany(this.$table, [
      [this.$options.columnForPath, "is like", dirpath + "%"]
    ]);
  }
};
        FlowsqlNodejs.FileSystem.prototype.exists = /**
 * 
 * ### `FlowsqlFileSystem.prototype.exists(filepath:String)`
 * 
 * Método para averiguar si existe un nodo basándose en una ruta.
 * 
 */
function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.exists»`);
  const node = this.findByPath(filepath);
  return node !== null;
};
        FlowsqlNodejs.FileSystem.prototype.existsFile = /**
 * 
 * ### `FlowsqlFileSystem.prototype.existsFile(filepath:String)`
 * 
 * Método para averiguar si existe un nodo y es un fichero basándose en una ruta.
 * 
 */
function(filepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.existsFile»`);
  const node = this.findByPath(filepath);
  if(node === null) {
    return false;
  }
  if(node[this.$options.columnForType] !== "file") {
    return false;
  }
  return true;
};
        FlowsqlNodejs.FileSystem.prototype.existsDirectory = /**
 * 
 * ### `FlowsqlFileSystem.prototype.existsDirectory(dirpath:String)`
 * 
 * Método para averiguar si existe un nodo basándose en una ruta.
 * 
 */
function(dirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.existsDirectory»`);
  const node = this.findByPath(filepath);
  if(node === null) {
    return false;
  }
  if(node[this.$options.columnForType] !== "directory") {
    return false;
  }
  return true;
};
        FlowsqlNodejs.FileSystem.prototype.renameFile = /**
 * 
 * ### `FlowsqlFileSystem.prototype.renameFile(filepath:String)`
 * 
 * Método para cambiar la ruta de un fichero.
 * 
 */
function(filepath, newFilepath) {
  this.assertion(typeof filepath === "string", `Parameter «filepath» must be a string on «FlowsqlFileSystem.prototype.renameFile»`);
  this.assertion(typeof newFilepath === "string", `Parameter «newFilepath» must be a string on «FlowsqlFileSystem.prototype.renameFile»`);

  const oldpath = this.constructor.normalizePath(filepath);
  const newpath = this.constructor.normalizePath(newFilepath);

  const matchedOld = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", oldpath]
  ]);

  if (matchedOld.length === 0) {
    throw new Error(`Cannot rename file because no file was found by «${filepath}» on «FlowsqlFileSystem.prototype.renameFile»`);
  } else if (matchedOld.length !== 1) {
    throw new Error(`Cannot rename file because multiple nodes with the same path. This should not happen if «${this.$options.columnForPath}» is unique on «${this.$table}» arised on «FlowsqlFileSystem.prototype.renameFile»`);
  }

  const row = matchedOld[0];
  if (row[this.$options.columnForType] !== "file") {
    throw new Error(`Cannot rename file because the node is not a file on «${oldpath}» on «FlowsqlFileSystem.prototype.renameFile»`);
  }

  const matchedNew = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", newpath]
  ]);

  if (matchedNew.length !== 0) {
    throw new Error(`Cannot rename file to «${newpath}» because another node already exists with that path on «FlowsqlFileSystem.prototype.renameFile»`);
  }

  return this.$flowsql.updateOne(this.$table, row.id, {
    [this.$options.columnForPath]: newpath
  });
};
        FlowsqlNodejs.FileSystem.prototype.renameDirectory = /**
 * 
 * ### `FlowsqlFileSystem.prototype.renameDirectory(dirpath:String)`
 * 
 * Método para cambiar la ruta de un directorio.
 * 
 */
function(dirpath, newDirpath) {
  this.assertion(typeof dirpath === "string", `Parameter «dirpath» must be a string on «FlowsqlFileSystem.prototype.renameDirectory»`);
  this.assertion(typeof newDirpath === "string", `Parameter «newDirpath» must be a string on «FlowsqlFileSystem.prototype.renameDirectory»`);

  const oldpath = this.constructor.normalizePath(dirpath);
  const newpath = this.constructor.normalizePath(newDirpath);

  const matchedOld = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", oldpath]
  ]);

  if(matchedOld.length === 0) {
    throw new Error(`Cannot rename directory because no directory was found by «${dirpath}» on «FlowsqlFileSystem.prototype.renameDirectory»`);
  } else if(matchedOld.length !== 1) {
    throw new Error(`Cannot rename directory because multiple nodes with the same path. This should not happen if «${this.$options.columnForPath}» is unique on «${this.$table}» arised on «FlowsqlFileSystem.prototype.renameDirectory»`);
  }

  const rowDir = matchedOld[0];
  if(rowDir[this.$options.columnForType] !== "directory") {
    throw new Error(`Cannot rename directory because the node is not a directory on «${oldpath}» on «FlowsqlFileSystem.prototype.renameDirectory»`);
  }

  const matchedNew = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "=", newpath]
  ]);
  if(matchedNew.length !== 0) {
    throw new Error(`Cannot rename directory to «${newpath}» because another node already exists with that path on «FlowsqlFileSystem.prototype.renameDirectory»`);
  }

  const allChildren = this.$flowsql.selectMany(this.$table, [
    [this.$options.columnForPath, "is like", oldpath + "/%"]
  ]);

  for(let i=0; i<allChildren.length; i++) {
    const row = allChildren[i];
    const oldChildPath = row[this.$options.columnForPath];

    if(!oldChildPath.startsWith(oldpath + "/")) {
      continue;
    }

    const rest = oldChildPath.substring((oldpath + "/").length);
    const newChildPath = this.constructor.normalizePath(newpath, rest);

    const matchedChildNew = this.$flowsql.selectMany(this.$table, [
      [this.$options.columnForPath, "=", newChildPath]
    ]);
    if(matchedChildNew.length !== 0) {
      throw new Error(`Cannot rename directory because a child rename conflict «${newChildPath}» already exists on «FlowsqlFileSystem.prototype.renameDirectory»`);
    }

    this.$flowsql.updateOne(this.$table, row.id, {
      [this.$options.columnForPath]: newChildPath
    });
  }

  return this.$flowsql.updateOne(this.$table, rowDir.id, {
    [this.$options.columnForPath]: newpath
  });
};
    }

    Include_query_api: {
        FlowsqlNodejs.prototype.createQuery = /**
 * 
 * ## Query APIU
 * 
 * ### `Flowsql.prototype.createQuery(table:String, filters:Array):FlowsqlQuery`
 * 
 * Método que construye una `Query`.
 * 
 * Consulta la interfaz de `Query` para más información.
 * 
 */
function(table, filters) {
  return new this.constructor.Query(this, table, filters);
};
        
        FlowsqlNodejs.Query = /**
 * 
 * ## Query API de Flowsql
 * 
 * ### `FlowsqlQuery.constructor(flowsql, table, filters):FlowsqlQuery`
 * 
 * Método constructor de objetos `Query`.
 * 
 */
function(flowsql, table, parameters) {
  this.$flowsql = flowsql;
  this.$table = table;
  this.$parameters = parameters;
  return this;
};
        FlowsqlNodejs.Query.Flowsql = FlowsqlNodejs;
        FlowsqlNodejs.Query.AssertionError = FlowsqlNodejs.AssertionError.bind(FlowsqlNodejs);
        FlowsqlNodejs.Query.defaultOptions = /**
 * 
 * ### `FlowsqlQuery.defaultOptions:Object`
 * 
 * Opciones por defecto del constructor `FlowsqlQuery`.
 * 
 */
{

};
        FlowsqlNodejs.Query.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        
        FlowsqlNodejs.Query.prototype.assertion = FlowsqlNodejs.prototype.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.Query.prototype.setParameters = /**
 * 
 * ### `FlowsqlQuery.prototype.setParameters(parameters:Object):FlowsqlQuery`
 * 
 * Método para preparar los parámetros de la `Query`.
 * 
 * Este método consiste en...
 * 
 */
function() {

};
        FlowsqlNodejs.Query.prototype.run = /**
 * 
 * ### `FlowsqlQuery.prototype.run():Promise<any>`
 * 
 * Método para correr la `Query.run`.
 * 
 * Este método consiste en...
 * 
 */
function() {

};
    }

    Include_firewall_api: {
        FlowsqlNodejs.Firewall = /**
 * 
 * ## Firewall API de Flowsql
 * 
 * ### `FlowsqlQuery.constructor(flowsql, table, filters):FlowsqlQuery`
 * 
 * Método constructor de objetos `Query`.
 * 
 */
function(flowsql, table, parameters) {
  this.$flowsql = flowsql;
  this.$table = table;
  this.$parameters = parameters;
  return this;
};
        FlowsqlNodejs.Firewall.Flowsql = FlowsqlNodejs;
        FlowsqlNodejs.Firewall.AssertionError = FlowsqlNodejs.AssertionError.bind(FlowsqlNodejs);
        FlowsqlNodejs.Firewall.defaultOptions = /**
 * 
 * ### `FlowsqlQuery.defaultOptions:Object`
 * 
 * Opciones por defecto del constructor `FlowsqlQuery`.
 * 
 */
{

};
        FlowsqlNodejs.Firewall.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        
        FlowsqlNodejs.Firewall.prototype.assertion = FlowsqlNodejs.prototype.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.Firewall.prototype.setSource = /**
 * 
 * ### `FlowsqlFirewall.prototype.setSource(source:String):FlowsqlFirewall`
 * 
 * Método para preparar el código fuente del `Firewall`.
 * 
 * Este método consiste en...
 * 
 */
function() {

};
        FlowsqlNodejs.Firewall.prototype.trigger = /**
 * 
 * ### `FlowsqlFirewall.prototype.trigger():Promise<any>`
 * 
 * Método para correr la `Firewall.trigger`.
 * 
 * Este método consiste en...
 * 
 */
function() {

};
    }

    Include_server_api: {
        FlowsqlNodejs.Server = /**
 * 
 * ## Server API de Flowsql
 * 
 * ### `FlowsqlServer.constructor(flowsql:Object, options:Object):FlowsqlServer`
 * 
 * Método constructor de objetos `Server`.
 * 
 */
function(flowsql, options) {
  this.$flowsql = flowsql;
  this.$options = options;
  return this;
};
        FlowsqlNodejs.Server.Flowsql = FlowsqlNodejs;
        FlowsqlNodejs.Server.AssertionError = FlowsqlNodejs.AssertionError.bind(FlowsqlNodejs);
        FlowsqlNodejs.Server.defaultOptions = /**
 * 
 * ### `FlowsqlServer.defaultOptions:Object`
 * 
 * Opciones por defecto del constructor `FlowsqlServer`.
 * 
 */
{

};
        FlowsqlNodejs.Server.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        
        FlowsqlNodejs.Server.prototype.assertion = FlowsqlNodejs.prototype.assertion.bind(FlowsqlNodejs);
        FlowsqlNodejs.Server.prototype.start = /**
 * 
 * ### `FlowsqlServer.prototype.start():FlowsqlServer`
 * 
 * Método para levantar la escucha de un objeto `Server`.
 * 
 * Este método consiste en...
 * 
 */
function() {

};
        FlowsqlNodejs.Server.prototype.stop = /**
 * 
 * ### `FlowsqlServer.prototype.stop():FlowsqlServer`
 * 
 * Método para parar la escucha de un objeto `Server`.
 * 
 * Este método consiste en...
 * 
 */
function() {

};
    }

    Include_client_api: {
        FlowsqlNodejs.Client = /**
 * 
 * ## Client API de Flowsql
 * 
 * ### `FlowsqlClient.constructor(options:Object):FlowsqlClient`
 * 
 * Método constructor de objetos `Client`. Sirven para lanzar queries al objeto `Server` vía net.
 * 
 */
function(options) {
  this.$flowsql = flowsql;
  this.$options = options;
  return this;
};
        FlowsqlNodejs.Client.Flowsql = FlowsqlNodejs;
        FlowsqlNodejs.Client.AssertionError = FlowsqlNodejs.AssertionError.bind(FlowsqlNodejs);
        FlowsqlNodejs.Client.defaultOptions = /**
 * 
 * ### `FlowsqlClient.defaultOptions:Object`
 * 
 * Opciones por defecto del constructor `FlowsqlClient`.
 * 
 */
{

};
        FlowsqlNodejs.Client.assertion = FlowsqlNodejs.assertion.bind(FlowsqlNodejs);
        
        FlowsqlNodejs.Client.prototype.assertion = FlowsqlNodejs.prototype.assertion.bind(FlowsqlNodejs);
    }

    Include_firewall_source: {
        // @generated by Peggy 5.0.6.
//
// https://peggyjs.org/
(function(root) {
  "use strict";
class peg$SyntaxError extends SyntaxError {
  constructor(message, expected, found, location) {
    super(message);
    this.expected = expected;
    this.found = found;
    this.location = location;
    this.name = "SyntaxError";
  }

  format(sources) {
    let str = "Error: " + this.message;
    if (this.location) {
      let src = null;
      const st = sources.find(s => s.source === this.location.source);
      if (st) {
        src = st.text.split(/\r\n|\n|\r/g);
      }
      const s = this.location.start;
      const offset_s = (this.location.source && (typeof this.location.source.offset === "function"))
        ? this.location.source.offset(s)
        : s;
      const loc = this.location.source + ":" + offset_s.line + ":" + offset_s.column;
      if (src) {
        const e = this.location.end;
        const filler = "".padEnd(offset_s.line.toString().length, " ");
        const line = src[s.line - 1];
        const last = s.line === e.line ? e.column : line.length + 1;
        const hatLen = (last - s.column) || 1;
        str += "\n --> " + loc + "\n"
            + filler + " |\n"
            + offset_s.line + " | " + line + "\n"
            + filler + " | " + "".padEnd(s.column - 1, " ")
            + "".padEnd(hatLen, "^");
      } else {
        str += "\n at " + loc;
      }
    }
    return str;
  }

  static buildMessage(expected, found) {
    function hex(ch) {
      return ch.codePointAt(0).toString(16).toUpperCase();
    }

    const nonPrintable = Object.prototype.hasOwnProperty.call(RegExp.prototype, "unicode")
      ? new RegExp("[\\p{C}\\p{Mn}\\p{Mc}]", "gu")
      : null;
    function unicodeEscape(s) {
      if (nonPrintable) {
        return s.replace(nonPrintable,  ch => "\\u{" + hex(ch) + "}");
      }
      return s;
    }

    function literalEscape(s) {
      return unicodeEscape(s
        .replace(/\\/g, "\\\\")
        .replace(/"/g,  "\\\"")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,          ch => "\\x0" + hex(ch))
        .replace(/[\x10-\x1F\x7F-\x9F]/g, ch => "\\x"  + hex(ch)));
    }

    function classEscape(s) {
      return unicodeEscape(s
        .replace(/\\/g, "\\\\")
        .replace(/\]/g, "\\]")
        .replace(/\^/g, "\\^")
        .replace(/-/g,  "\\-")
        .replace(/\0/g, "\\0")
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/[\x00-\x0F]/g,          ch => "\\x0" + hex(ch))
        .replace(/[\x10-\x1F\x7F-\x9F]/g, ch => "\\x"  + hex(ch)));
    }

    const DESCRIBE_EXPECTATION_FNS = {
      literal(expectation) {
        return "\"" + literalEscape(expectation.text) + "\"";
      },

      class(expectation) {
        const escapedParts = expectation.parts.map(
          part => (Array.isArray(part)
            ? classEscape(part[0]) + "-" + classEscape(part[1])
            : classEscape(part))
        );

        return "[" + (expectation.inverted ? "^" : "") + escapedParts.join("") + "]" + (expectation.unicode ? "u" : "");
      },

      any() {
        return "any character";
      },

      end() {
        return "end of input";
      },

      other(expectation) {
        return expectation.description;
      },
    };

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      const descriptions = expected.map(describeExpectation);
      descriptions.sort();

      if (descriptions.length > 0) {
        let j = 1;
        for (let i = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  }
}

function peg$parse(input, options) {
  options = options !== undefined ? options : {};

  const peg$FAILED = {};
  const peg$source = options.grammarSource;

  const peg$startRuleFunctions = {
    Controller_language: peg$parseController_language,
  };
  let peg$startRuleFunction = peg$parseController_language;

  const peg$c0 = "if";
  const peg$c1 = "then";
  const peg$c2 = "else";
  const peg$c3 = "or";
  const peg$c4 = "and";
  const peg$c5 = "not";
  const peg$c6 = "(";
  const peg$c7 = ")";
  const peg$c8 = "create";
  const peg$c9 = "as";
  const peg$c10 = "assign";
  const peg$c11 = "to";
  const peg$c12 = "always";
  const peg$c13 = "define block";
  const peg$c14 = "follow block";
  const peg$c15 = "throw";
  const peg$c16 = "start";
  const peg$c17 = "process";
  const peg$c18 = "break";
  const peg$c19 = "event on";
  const peg$c20 = "model";
  const peg$c21 = "operation";
  const peg$c22 = "{";
  const peg$c23 = "}";
  const peg$c24 = "\"";
  const peg$c25 = "\\\"";
  const peg$c26 = "{{";
  const peg$c27 = "}}";
  const peg$c28 = "\r\n";

  const peg$r0 = /^[A-Za-z_$]/;
  const peg$r1 = /^[A-Za-z0-9_$]/;
  const peg$r2 = /^[\t ]/;
  const peg$r3 = /^[\n\r]/;

  const peg$e0 = peg$literalExpectation("if", false);
  const peg$e1 = peg$literalExpectation("then", false);
  const peg$e2 = peg$literalExpectation("else", false);
  const peg$e3 = peg$literalExpectation("or", false);
  const peg$e4 = peg$literalExpectation("and", false);
  const peg$e5 = peg$literalExpectation("not", false);
  const peg$e6 = peg$literalExpectation("(", false);
  const peg$e7 = peg$literalExpectation(")", false);
  const peg$e8 = peg$literalExpectation("create", false);
  const peg$e9 = peg$literalExpectation("as", false);
  const peg$e10 = peg$literalExpectation("assign", false);
  const peg$e11 = peg$literalExpectation("to", false);
  const peg$e12 = peg$literalExpectation("always", false);
  const peg$e13 = peg$literalExpectation("define block", false);
  const peg$e14 = peg$literalExpectation("follow block", false);
  const peg$e15 = peg$literalExpectation("throw", false);
  const peg$e16 = peg$literalExpectation("start", false);
  const peg$e17 = peg$literalExpectation("process", false);
  const peg$e18 = peg$literalExpectation("break", false);
  const peg$e19 = peg$literalExpectation("event on", false);
  const peg$e20 = peg$literalExpectation("model", false);
  const peg$e21 = peg$literalExpectation("operation", false);
  const peg$e22 = peg$literalExpectation("{", false);
  const peg$e23 = peg$literalExpectation("}", false);
  const peg$e24 = peg$literalExpectation("\"", false);
  const peg$e25 = peg$literalExpectation("\\\"", false);
  const peg$e26 = peg$anyExpectation();
  const peg$e27 = peg$literalExpectation("{{", false);
  const peg$e28 = peg$literalExpectation("}}", false);
  const peg$e29 = peg$classExpectation([["A", "Z"], ["a", "z"], "_", "$"], false, false, false);
  const peg$e30 = peg$classExpectation([["A", "Z"], ["a", "z"], ["0", "9"], "_", "$"], false, false, false);
  const peg$e31 = peg$classExpectation(["\t", " "], false, false, false);
  const peg$e32 = peg$literalExpectation("\r\n", false);
  const peg$e33 = peg$classExpectation(["\n", "\r"], false, false, false);

  function peg$f0(ast) {    return ast  }
  function peg$f1(ast) {    return ast.join("")  }
  function peg$f2(condition, then, elseIf, elsez) {    return to_js({ sentence:"if then", condition, then, elseIf, else: elsez })  }
  function peg$f3(condition, then) {    return { condition, then }  }
  function peg$f4(then) {    return then  }
  function peg$f5(head) {    return head;  }
  function peg$f6(left, right) {    return right;  }
  function peg$f7(left, tail) {
    return [left].concat(tail).join(" || ");
  }
  function peg$f8(left, right) {    return right;  }
  function peg$f9(left, tail) {
    return [left].concat(tail).join(" && ");
  }
  function peg$f10(expr) {    return "!(" + expr + ")";  }
  function peg$f11(expr) {    return "(" + expr + ")";  }
  function peg$f12(create, as) {    return to_js({ sentence:"create", create, as })  }
  function peg$f13(source, value) {    return to_js({ sentence:"assign", source, value })  }
  function peg$f14(token1, then) {    return to_js({ sentence:"always", then })  }
  function peg$f15(processId, then) {    return to_js({ sentence:"define block", processId, then })  }
  function peg$f16(processId) {    return to_js({ sentence:"follow block", processId })  }
  function peg$f17(error) {    return to_js({ sentence:"throw", error })  }
  function peg$f18(processId, then) {    return to_js({ sentence:"start process", processId, then })  }
  function peg$f19(processId) {    return to_js({ sentence:"break process", processId })  }
  function peg$f20(token1, model, operation, then) {    return to_js({ sentence: "event", model, operation, then })  }
  function peg$f21(model) {    return model  }
  function peg$f22(operation) {    return operation  }
  function peg$f23(block) {    return block  }
  function peg$f24(block) {    return block  }
  function peg$f25(t1, tn) {    return [t1].concat(tn);  }
  function peg$f26(t) {    return t  }
  function peg$f27(t) {    return t  }
  function peg$f28() {    return text()  }
  function peg$f29(t) {    return t  }
  function peg$f30() {    return text()  }
  function peg$f31() {    return text()  }
  let peg$currPos = options.peg$currPos | 0;
  let peg$savedPos = peg$currPos;
  const peg$posDetailsCache = [{ line: 1, column: 1 }];
  let peg$maxFailPos = peg$currPos;
  let peg$maxFailExpected = options.peg$maxFailExpected || [];
  let peg$silentFails = options.peg$silentFails | 0;

  let peg$result;

  if (options.startRule) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function offset() {
    return peg$savedPos;
  }

  function range() {
    return {
      source: peg$source,
      start: peg$savedPos,
      end: peg$currPos,
    };
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== undefined
      ? location
      : peg$computeLocation(peg$savedPos, peg$currPos);

    throw peg$buildSimpleError(message, location);
  }

  function peg$getUnicode(pos = peg$currPos) {
    const cp = input.codePointAt(pos);
    if (cp === undefined) {
      return "";
    }
    return String.fromCodePoint(cp);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text, ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase, unicode) {
    return { type: "class", parts, inverted, ignoreCase, unicode };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description };
  }

  function peg$computePosDetails(pos) {
    let details = peg$posDetailsCache[pos];
    let p;

    if (details) {
      return details;
    } else {
      if (pos >= peg$posDetailsCache.length) {
        p = peg$posDetailsCache.length - 1;
      } else {
        p = pos;
        while (!peg$posDetailsCache[--p]) {}
      }

      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column,
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;

      return details;
    }
  }

  function peg$computeLocation(startPos, endPos, offset) {
    const startPosDetails = peg$computePosDetails(startPos);
    const endPosDetails = peg$computePosDetails(endPos);

    const res = {
      source: peg$source,
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column,
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column,
      },
    };
    if (offset && peg$source && (typeof peg$source.offset === "function")) {
      res.start = peg$source.offset(res.start);
      res.end = peg$source.offset(res.end);
    }
    return res;
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parseController_language() {
    let s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseController_block();
    peg$savedPos = s0;
    s1 = peg$f0(s1);
    s0 = s1;

    return s0;
  }

  function peg$parseController_block() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseController_sentence();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parseController_sentence();
    }
    s2 = [];
    s3 = peg$parse_();
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$parse_();
    }
    peg$savedPos = s0;
    s0 = peg$f1(s1);

    return s0;
  }

  function peg$parseBlock() {
    let s0;

    s0 = peg$parseController_sentence();
    if (s0 === peg$FAILED) {
      s0 = peg$parseBlock_wrapped();
    }

    return s0;
  }

  function peg$parseController_sentence() {
    let s0;

    s0 = peg$parseEvent_sentence();
    if (s0 === peg$FAILED) {
      s0 = peg$parseStart_process_sentence();
      if (s0 === peg$FAILED) {
        s0 = peg$parseBreak_process_sentence();
        if (s0 === peg$FAILED) {
          s0 = peg$parseCreate_sentence();
          if (s0 === peg$FAILED) {
            s0 = peg$parseAssign_sentence();
            if (s0 === peg$FAILED) {
              s0 = peg$parseAlways_sentence();
              if (s0 === peg$FAILED) {
                s0 = peg$parseDefine_block_sentence();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseFollow_block_sentence();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parseThrow_sentence();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parseIf_sentence();
                      if (s0 === peg$FAILED) {
                        s0 = peg$parseNative_expression();
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseIf_sentence() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 2) === peg$c0) {
      s2 = peg$c0;
      peg$currPos += 2;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e0); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseLogical_expression();
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            if (input.substr(peg$currPos, 4) === peg$c1) {
              s6 = peg$c1;
              peg$currPos += 4;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e1); }
            }
            if (s6 !== peg$FAILED) {
              s7 = [];
              s8 = peg$parse_();
              if (s8 !== peg$FAILED) {
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parse_();
                }
              } else {
                s7 = peg$FAILED;
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parseBlock();
                if (s8 !== peg$FAILED) {
                  s9 = [];
                  s10 = peg$parseSubsentence_else_if();
                  while (s10 !== peg$FAILED) {
                    s9.push(s10);
                    s10 = peg$parseSubsentence_else_if();
                  }
                  s10 = peg$parseSubsentence_else();
                  if (s10 === peg$FAILED) {
                    s10 = null;
                  }
                  peg$savedPos = s0;
                  s0 = peg$f2(s4, s8, s9, s10);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSubsentence_else_if() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 4) === peg$c2) {
      s2 = peg$c2;
      peg$currPos += 4;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e2); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c0) {
          s4 = peg$c0;
          peg$currPos += 2;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e0); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseLogical_expression();
            if (s6 !== peg$FAILED) {
              s7 = [];
              s8 = peg$parse_();
              if (s8 !== peg$FAILED) {
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parse_();
                }
              } else {
                s7 = peg$FAILED;
              }
              if (s7 !== peg$FAILED) {
                if (input.substr(peg$currPos, 4) === peg$c1) {
                  s8 = peg$c1;
                  peg$currPos += 4;
                } else {
                  s8 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$e1); }
                }
                if (s8 !== peg$FAILED) {
                  s9 = [];
                  s10 = peg$parse_();
                  if (s10 !== peg$FAILED) {
                    while (s10 !== peg$FAILED) {
                      s9.push(s10);
                      s10 = peg$parse_();
                    }
                  } else {
                    s9 = peg$FAILED;
                  }
                  if (s9 !== peg$FAILED) {
                    s10 = peg$parseBlock();
                    if (s10 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s0 = peg$f3(s6, s10);
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSubsentence_else() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 4) === peg$c2) {
      s2 = peg$c2;
      peg$currPos += 4;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e2); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parse_();
      }
      s4 = peg$parseBlock();
      if (s4 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f4(s4);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLogical_expression() {
    let s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseOr_expression();
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f5(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseOr_expression() {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseAnd_expression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = [];
      s5 = peg$parse_();
      if (s5 !== peg$FAILED) {
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c3) {
          s5 = peg$c3;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e3); }
        }
        if (s5 !== peg$FAILED) {
          s6 = [];
          s7 = peg$parse_();
          if (s7 !== peg$FAILED) {
            while (s7 !== peg$FAILED) {
              s6.push(s7);
              s7 = peg$parse_();
            }
          } else {
            s6 = peg$FAILED;
          }
          if (s6 !== peg$FAILED) {
            s7 = peg$parseAnd_expression();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s3;
              s3 = peg$f6(s1, s7);
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = [];
        s5 = peg$parse_();
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parse_();
          }
        } else {
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c3) {
            s5 = peg$c3;
            peg$currPos += 2;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e3); }
          }
          if (s5 !== peg$FAILED) {
            s6 = [];
            s7 = peg$parse_();
            if (s7 !== peg$FAILED) {
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$parse_();
              }
            } else {
              s6 = peg$FAILED;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseAnd_expression();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s3;
                s3 = peg$f6(s1, s7);
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f7(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAnd_expression() {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = peg$parseNot_expression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = [];
      s5 = peg$parse_();
      if (s5 !== peg$FAILED) {
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c4) {
          s5 = peg$c4;
          peg$currPos += 3;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e4); }
        }
        if (s5 !== peg$FAILED) {
          s6 = [];
          s7 = peg$parse_();
          if (s7 !== peg$FAILED) {
            while (s7 !== peg$FAILED) {
              s6.push(s7);
              s7 = peg$parse_();
            }
          } else {
            s6 = peg$FAILED;
          }
          if (s6 !== peg$FAILED) {
            s7 = peg$parseNot_expression();
            if (s7 !== peg$FAILED) {
              peg$savedPos = s3;
              s3 = peg$f8(s1, s7);
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = [];
        s5 = peg$parse_();
        if (s5 !== peg$FAILED) {
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parse_();
          }
        } else {
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          if (input.substr(peg$currPos, 3) === peg$c4) {
            s5 = peg$c4;
            peg$currPos += 3;
          } else {
            s5 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e4); }
          }
          if (s5 !== peg$FAILED) {
            s6 = [];
            s7 = peg$parse_();
            if (s7 !== peg$FAILED) {
              while (s7 !== peg$FAILED) {
                s6.push(s7);
                s7 = peg$parse_();
              }
            } else {
              s6 = peg$FAILED;
            }
            if (s6 !== peg$FAILED) {
              s7 = peg$parseNot_expression();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s3;
                s3 = peg$f8(s1, s7);
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      peg$savedPos = s0;
      s0 = peg$f9(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNot_expression() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c5) {
      s1 = peg$c5;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e5); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parse_();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsePrimary_expression();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f10(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parsePrimary_expression();
    }

    return s0;
  }

  function peg$parsePrimary_expression() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 40) {
      s1 = peg$c6;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e6); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parse_();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parse_();
      }
      s3 = peg$parseLogical_expression();
      if (s3 !== peg$FAILED) {
        s4 = [];
        s5 = peg$parse_();
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
        if (input.charCodeAt(peg$currPos) === 41) {
          s5 = peg$c7;
          peg$currPos++;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e7); }
        }
        if (s5 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f11(s3);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseNative_expression();
      if (s0 === peg$FAILED) {
        s0 = peg$parseJavascript_id();
      }
    }

    return s0;
  }

  function peg$parseCreate_sentence() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 6) === peg$c8) {
      s2 = peg$c8;
      peg$currPos += 6;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e8); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseJavascript_id();
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c9) {
              s6 = peg$c9;
              peg$currPos += 2;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e9); }
            }
            if (s6 !== peg$FAILED) {
              s7 = [];
              s8 = peg$parse_();
              if (s8 !== peg$FAILED) {
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parse_();
                }
              } else {
                s7 = peg$FAILED;
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parseLogical_expression();
                if (s8 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f12(s4, s8);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAssign_sentence() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 6) === peg$c10) {
      s2 = peg$c10;
      peg$currPos += 6;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e10); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseJavascript_id();
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            if (input.substr(peg$currPos, 2) === peg$c11) {
              s6 = peg$c11;
              peg$currPos += 2;
            } else {
              s6 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e11); }
            }
            if (s6 !== peg$FAILED) {
              s7 = [];
              s8 = peg$parse_();
              if (s8 !== peg$FAILED) {
                while (s8 !== peg$FAILED) {
                  s7.push(s8);
                  s8 = peg$parse_();
                }
              } else {
                s7 = peg$FAILED;
              }
              if (s7 !== peg$FAILED) {
                s8 = peg$parseLogical_expression();
                if (s8 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s0 = peg$f13(s4, s8);
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAlways_sentence() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    s3 = peg$parse_();
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$parse_();
    }
    if (input.substr(peg$currPos, 6) === peg$c12) {
      s3 = peg$c12;
      peg$currPos += 6;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e12); }
    }
    if (s3 !== peg$FAILED) {
      s4 = [];
      s5 = peg$parse_();
      if (s5 !== peg$FAILED) {
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s2 = [s2, s3, s4];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseNative_expression();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f14(s1, s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDefine_block_sentence() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 12) === peg$c13) {
      s2 = peg$c13;
      peg$currPos += 12;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e13); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseJavascript_id();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseBlock_wrapped();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s0;
            s0 = peg$f15(s4, s5);
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFollow_block_sentence() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 12) === peg$c14) {
      s2 = peg$c14;
      peg$currPos += 12;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e14); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseJavascript_id();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f16(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseThrow_sentence() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 5) === peg$c15) {
      s2 = peg$c15;
      peg$currPos += 5;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e15); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseNative_expression();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f17(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseStart_process_sentence() {
    let s0, s1, s2, s3, s4, s5, s6, s7;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 5) === peg$c16) {
      s2 = peg$c16;
      peg$currPos += 5;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e16); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c17) {
          s4 = peg$c17;
          peg$currPos += 7;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e17); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseJavascript_id();
            if (s6 !== peg$FAILED) {
              s7 = peg$parseBlock_wrapped();
              if (s7 !== peg$FAILED) {
                peg$savedPos = s0;
                s0 = peg$f18(s6, s7);
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseBreak_process_sentence() {
    let s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 5) === peg$c18) {
      s2 = peg$c18;
      peg$currPos += 5;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e18); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c17) {
          s4 = peg$c17;
          peg$currPos += 7;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e17); }
        }
        if (s4 !== peg$FAILED) {
          s5 = [];
          s6 = peg$parse_();
          if (s6 !== peg$FAILED) {
            while (s6 !== peg$FAILED) {
              s5.push(s6);
              s6 = peg$parse_();
            }
          } else {
            s5 = peg$FAILED;
          }
          if (s5 !== peg$FAILED) {
            s6 = peg$parseJavascript_id();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s0;
              s0 = peg$f19(s6);
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseEvent_sentence() {
    let s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = [];
    s3 = peg$parse_();
    while (s3 !== peg$FAILED) {
      s2.push(s3);
      s3 = peg$parse_();
    }
    if (input.substr(peg$currPos, 8) === peg$c19) {
      s3 = peg$c19;
      peg$currPos += 8;
    } else {
      s3 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e19); }
    }
    if (s3 !== peg$FAILED) {
      s4 = [];
      s5 = peg$parse_();
      if (s5 !== peg$FAILED) {
        while (s5 !== peg$FAILED) {
          s4.push(s5);
          s5 = peg$parse_();
        }
      } else {
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s2 = [s2, s3, s4];
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseModel_subsentence();
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      s3 = peg$parseOperation_subsentence();
      if (s3 !== peg$FAILED) {
        s4 = peg$parseThen_subsentence();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f20(s1, s2, s3, s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseModel_subsentence() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 5) === peg$c20) {
      s2 = peg$c20;
      peg$currPos += 5;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e20); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseText_list();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f21(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseOperation_subsentence() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 9) === peg$c21) {
      s2 = peg$c21;
      peg$currPos += 9;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e21); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseText_list();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f22(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseThen_subsentence() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.substr(peg$currPos, 4) === peg$c1) {
      s2 = peg$c1;
      peg$currPos += 4;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e1); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      if (s4 !== peg$FAILED) {
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parse_();
        }
      } else {
        s3 = peg$FAILED;
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseBlock();
        if (s4 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f23(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseBlock_wrapped() {
    let s0, s1, s2, s3, s4, s5, s6, s7, s8;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parse_();
    }
    if (input.charCodeAt(peg$currPos) === 123) {
      s2 = peg$c22;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e22); }
    }
    if (s2 !== peg$FAILED) {
      s3 = [];
      s4 = peg$parse_();
      while (s4 !== peg$FAILED) {
        s3.push(s4);
        s4 = peg$parse_();
      }
      s4 = peg$parseController_block();
      if (s4 !== peg$FAILED) {
        s5 = [];
        s6 = peg$parse_();
        while (s6 !== peg$FAILED) {
          s5.push(s6);
          s6 = peg$parse_();
        }
        if (input.charCodeAt(peg$currPos) === 125) {
          s6 = peg$c23;
          peg$currPos++;
        } else {
          s6 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e23); }
        }
        if (s6 !== peg$FAILED) {
          s7 = [];
          s8 = peg$parse_();
          while (s8 !== peg$FAILED) {
            s7.push(s8);
            s8 = peg$parse_();
          }
          peg$savedPos = s0;
          s0 = peg$f24(s4);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseText_list() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseText();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseText_n();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseText_n();
      }
      peg$savedPos = s0;
      s0 = peg$f25(s1, s2);
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseText_n() {
    let s0, s1, s2;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parse_();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parse_();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseText();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s0 = peg$f26(s2);
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseText() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c24;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e24); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseText_content();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s3 = peg$c24;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e24); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f27(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseText_content() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$currPos;
    peg$silentFails++;
    if (input.charCodeAt(peg$currPos) === 34) {
      s4 = peg$c24;
      peg$currPos++;
    } else {
      s4 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e24); }
    }
    peg$silentFails--;
    if (s4 === peg$FAILED) {
      s3 = undefined;
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    if (s3 !== peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c25) {
        s4 = peg$c25;
        peg$currPos += 2;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e25); }
      }
      if (s4 === peg$FAILED) {
        if (input.length > peg$currPos) {
          s4 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e26); }
        }
      }
      if (s4 !== peg$FAILED) {
        s3 = [s3, s4];
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        if (input.charCodeAt(peg$currPos) === 34) {
          s4 = peg$c24;
          peg$currPos++;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e24); }
        }
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = undefined;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          if (input.substr(peg$currPos, 2) === peg$c25) {
            s4 = peg$c25;
            peg$currPos += 2;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e25); }
          }
          if (s4 === peg$FAILED) {
            if (input.length > peg$currPos) {
              s4 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$e26); }
            }
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f28();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseNative_expression() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c26) {
      s1 = peg$c26;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e27); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseNative_expression_content();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c27) {
          s3 = peg$c27;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e28); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s0 = peg$f29(s2);
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseNative_expression_content() {
    let s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$currPos;
    peg$silentFails++;
    if (input.substr(peg$currPos, 2) === peg$c27) {
      s4 = peg$c27;
      peg$currPos += 2;
    } else {
      s4 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e28); }
    }
    peg$silentFails--;
    if (s4 === peg$FAILED) {
      s3 = undefined;
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    if (s3 !== peg$FAILED) {
      if (input.length > peg$currPos) {
        s4 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e26); }
      }
      if (s4 !== peg$FAILED) {
        s3 = [s3, s4];
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c27) {
          s4 = peg$c27;
          peg$currPos += 2;
        } else {
          s4 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e28); }
        }
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = undefined;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          if (input.length > peg$currPos) {
            s4 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$e26); }
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$f30();
    }
    s0 = s1;

    return s0;
  }

  function peg$parseJavascript_id() {
    let s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = input.charAt(peg$currPos);
    if (peg$r0.test(s1)) {
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e29); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = input.charAt(peg$currPos);
      if (peg$r1.test(s3)) {
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e30); }
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = input.charAt(peg$currPos);
        if (peg$r1.test(s3)) {
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$e30); }
        }
      }
      peg$savedPos = s0;
      s0 = peg$f31();
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parse_() {
    let s0;

    s0 = peg$parse__();
    if (s0 === peg$FAILED) {
      s0 = peg$parse___();
    }

    return s0;
  }

  function peg$parse__() {
    let s0;

    s0 = input.charAt(peg$currPos);
    if (peg$r2.test(s0)) {
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e31); }
    }

    return s0;
  }

  function peg$parse___() {
    let s0;

    if (input.substr(peg$currPos, 2) === peg$c28) {
      s0 = peg$c28;
      peg$currPos += 2;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$e32); }
    }
    if (s0 === peg$FAILED) {
      s0 = input.charAt(peg$currPos);
      if (peg$r3.test(s0)) {
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$e33); }
      }
    }

    return s0;
  }


  const definedProcesses = {};
  const to_js = function(item) {
    switch(item.sentence) {
      case "create":
        return "let " + item.create + " = " + item.as + ";\n";
      case "break process":
        return "break " + item.processId + ";\n";
      case "define block":
        definedProcesses[item.processId] = item.then;
        return "";
      case "assign":
        return item.source + " = " + item.value + ";\n";
      case "follow block":
        return definedProcesses[item.processId].trim() + "\n";
      case "throw":
        return "throw " + item.error + ";\n";
      case "always":
        return "" + item.then + "\n";
      case "start process":
        return item.processId + ": {\n  " + item.then.trim() + "\n}\n";
      case "if then":
        let out = "if(" + item.condition + ") {\n  " + item.then.trim() + "\n}";
        for(let i=0; i<item.elseIf.length; i++) {
          const elseIf = item.elseIf[i];
          out += "\nelse if(" + elseIf.condition + ") {\n  " + elseIf.then.trim() + "\n}";
        }
        if(item.else) {
          out += "\nelse {\n  " + item.else.trim() + "\n}\n";
        }
        return out;
      case "event":
        return `await (async (condition) => {\n  if(condition) return false;\n  ${item.then.trim()}\n})((${JSON.stringify(item.model || [])}.indexOf(args[0]) !== -1) && (${JSON.stringify(item.operation || [])}).indexOf(operation) !== -1);\n\n`;
    }
  };

  peg$result = peg$startRuleFunction();

  const peg$success = (peg$result !== peg$FAILED && peg$currPos === input.length);
  function peg$throw() {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? peg$getUnicode(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
  if (options.peg$library) {
    return /** @type {any} */ ({
      peg$result,
      peg$currPos,
      peg$FAILED,
      peg$maxFailExpected,
      peg$maxFailPos,
      peg$success,
      peg$throw: peg$success ? undefined : peg$throw,
    });
  }
  if (peg$success) {
    return peg$result;
  } else {
    peg$throw();
  }
}

  root.FirewallParser = {
    StartRules: ["Controller_language"],
    SyntaxError: peg$SyntaxError,
    parse: peg$parse,
  };
})(this);
    }



module.exports = FlowsqlNodejs;