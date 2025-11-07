

(function() {

    const FlowsqlBrowser = /**
 * 
 * ### `FlowsqlBrowser.constructor(options:Object)`
 * 
 * Método que construye una instancia `FlowsqlBrowser`.
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
  console.log("[*] Connecting to FlowsqlBrowser database from file: " + this.$options.filename);
  return this;
};

    FlowsqlBrowser.create = function(...args) {
  return new this(...args);
};
    FlowsqlBrowser.assertion = function(assertion, errorMessage = "assertion failed") {
  if(!assertion) {
    throw new this.AssertionError(errorMessage);
  }
};
    FlowsqlBrowser.AssertionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};
    FlowsqlBrowser.defaultOptions = /**
 * 
 * ### `FlowsqlBrowser.defaultOptions:Object`
 * 
 * ```js
 * {
 *  trace: false,
 *  traceSql: false,
 *  filename: "db.sqlite"
 * }
 * ```
 */
{
  trace: false,
  traceSql: false,
  filename: "db.sqlite"
};
    FlowsqlBrowser.defaultDatabaseOptions = {
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: (...args) => { },
};
    FlowsqlBrowser.dependencies = /**
 * 
 * ### `Flowsql.dependencies:Object`
 * 
 * Objeto que sirve para inyectar framework externos en la instancia de `Flowsql`.
 * 
 * Tiene los siguientes valores:
 * 
 * ```js
 * {
 *   
 * }
 * ```
 * 
 */
{
  
};
    FlowsqlBrowser.escapeId = function(value) {
  return "`" + value.replace(/`/g, "") + "`";
};
    FlowsqlBrowser.escapeValue = function(value) {
  if(typeof value === "string") {
    return "'" + value.replace(/'/g, "''") + "'";
  }
  return value;
};
    FlowsqlBrowser.getSqlType = function(columnType, columnMetadata) {
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
    FlowsqlBrowser.knownTypes = [
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
    FlowsqlBrowser.knownOperators = [
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
    FlowsqlBrowser.copyObject = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};
    FlowsqlBrowser.arrayContainsAnyOf = function(a, b) {
  if (a.length > b.length) {
    [a, b] = [b, a]; // iterar la más corta
  }
  const set = new Set(b);
  for (let i = 0; i < a.length; i++) {
    if (set.has(a[i])) return true;
  }
  return false;
};

    FlowsqlBrowser.prototype._ensureBasicMetadata = async function() {
  this.trace("_ensureBasicMetadata|Browser");
  await this.runSql(`
    CREATE TABLE IF NOT EXISTS Database_metadata (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) UNIQUE NOT NULL,
      value TEXT
    );
  `);
  const schemaQuery = await this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  console.log(schemaQuery);
  const schemaData = this._compactResults(schemaQuery);
  console.log(schemaData);
  if (schemaData.length !== 0) {
    console.log("not inserting");
    return;
  }
  console.log("inserting");
  const defaultSchema = this.constructor.escapeValue(JSON.stringify({ tables: {} }));
  await this.runSql(`
    INSERT INTO Database_metadata (name, value)
    VALUES ('db.schema', ${defaultSchema});
  `);
};
    FlowsqlBrowser.prototype._loadSchema = /**
 * 
 * ### `FlowsqlBrowser.prototype._loadSchema()`
 * 
 * Método para cargar el `this.$schema` de la instancia `Flowsql` con el valor que hay en la base de datos, en `Database_metadata` con `name=db.schema`.
 * 
 */
async function() {
  this.trace("_loadSchema|Browser");
  const schemaQuery = await this.fetchSql(`
    SELECT *
    FROM Database_metadata
    WHERE name = 'db.schema';
  `);
  const schemaData = this._compactResults(schemaQuery);
  this.constructor.assertion(Array.isArray(schemaData), `Could not match «db.schema» on database «Database_metadata» on «_loadSchema»`);
  this.constructor.assertion(schemaData.length === 1, `Could not find «db.schema» on database «Database_metadata» on «_loadSchema»`);
  const schemaJson = schemaData[0].value;
  this.constructor.assertion(typeof schemaJson === "string", `Value of «db.schema» on database «Database_metadata» must be a string on «_loadSchema»`);
  const schema = JSON.parse(schemaJson);
  this.$schema = schema;
};
    FlowsqlBrowser.prototype._persistSchema = function() {
  this.trace("_persistSchema");
  return this.runSql(`
    UPDATE Database_metadata
    SET value = ${this.constructor.escapeValue(JSON.stringify(this.$schema))}
    WHERE name = 'db.schema';
  `);
};
    FlowsqlBrowser.prototype._compactResults = /**
 * 
 * ### `FlowsqlBrowser.prototype._compactResults(input:Array)`
 * 
 * Método para compactar los resultados de una query tipo `SELECT` en el entorno de navegador.
 * 
 * Este método hace homogénea la salida de `sql.js` en el browser y `better-sqlite3` en node.js.
 * 
 * Pasa de [{column,values}] ===> [{column,value},...]
 * 
 */

function(input) {
  this.trace("_compactResults|Browser");
  if (input.length === 0) { return input }
  const results = input[0];
  const { columns, values } = results;
  const out = values.map(row =>
    columns.reduce((obj, col, i) => {
      obj[col] = row[i];
      return obj;
    }, {})
  );
  return out;
};
    FlowsqlBrowser.prototype._createRelationalTable = function(table, columnId, referredTable) {
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
    FlowsqlBrowser.prototype._validateFilters = function(table, filters) {
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
    FlowsqlBrowser.prototype._sqlForColumn = function(columnId, columnMetadata) {
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
    FlowsqlBrowser.prototype._sqlForWhere = function(table, filters) {
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
    } else {
      throw new Error("Not supported yet operator: " + operator);
    }
  }
  return sql;
};
    FlowsqlBrowser.prototype._sqlForInsertInto = function(table, row) {
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
    FlowsqlBrowser.prototype._sqlForInsertValues = function(table, row) {
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
    FlowsqlBrowser.prototype._sqlForUpdateSet = function(table, row) {
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
    FlowsqlBrowser.prototype._validateInstance = function(table, values, operation) {
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
    FlowsqlBrowser.prototype._selectMany = function(table, filters, byMethod = "_selectMany") {
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
    FlowsqlBrowser.prototype._insertMany = function(table, rows, byMethod = "_insertMany") {
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
    FlowsqlBrowser.prototype._updateMany = function(table, filters, values, byMethod = "_updateMany") {
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
    FlowsqlBrowser.prototype._deleteMany = function(table, filters, byMethod = "_deleteMany") {
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

    FlowsqlBrowser.prototype.assertion = FlowsqlBrowser.assertion.bind(FlowsqlBrowser);

    FlowsqlBrowser.prototype.fetchSql = async function(sql) {
  this.trace("fetchSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = await this.$database.exec(sql);
  return data1;
};
    FlowsqlBrowser.prototype.insertSql = async function(sql) {
  this.trace("insertSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = await this.$database.exec(sql);
  return data1;
};
    FlowsqlBrowser.prototype.runSql = async function(sql) {
  this.trace("runSql|Browser");
  if (this.$options.traceSql) {
    console.log("[sql]\n", sql);
  }
  const data1 = await this.$database.exec(sql);
  return data1;
};
    FlowsqlBrowser.prototype.connect = /**
 * 
 * ### `FlowsqlBrowser.prototype.connect()`
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
async function() {
  this.trace("connect|Browser");
  const SQL = await initSqlJs({
    locateFile: file => `sql-wasm.wasm`
  });
  this.$database = new SQL.Database(this.$options.databaseOptions);
  await this._ensureBasicMetadata();
  await this._loadSchema();
  return this;
};
    FlowsqlBrowser.prototype.trace = function(method, args = []) {
  if(this.$options.trace) {
    console.log("[trace][flowsql]", method, args.length === 0 ? "" : args.map(arg => typeof arg).join(", "));
  }
};

    FlowsqlBrowser.prototype.extractSqlSchema = function() {
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
    FlowsqlBrowser.prototype.validateSchema = function(schema) {
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
    FlowsqlBrowser.prototype.addTable = function(table, partialSchema) {
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
    FlowsqlBrowser.prototype.addColumn = function(table, columnId, partialSchema) {
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
    FlowsqlBrowser.prototype.renameTable = function(table, newName) {
  this.trace("renameTable", [...arguments]);
  this.assertion(typeof table === "string", `Parameter «table» must be a string on «renameTable»`);
  this.assertion(typeof newName === "string", `Parameter «newName» must be a string on «renameTable»`);
  this.runSql(`ALTER TABLE ${this.constructor.escapeId(table)} RENAME TO ${this.constructor.escapeId(newName)}`);
  this.$schema.tables[newName] = this.constructor.copyObject(this.$schema.tables[table]);
  delete this.$schema.tables[table];
  this._persistSchema();
};
    FlowsqlBrowser.prototype.renameColumn = function(table, columnId, newName) {
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
    FlowsqlBrowser.prototype.dropTable = function(table) {
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
    FlowsqlBrowser.prototype.dropColumn = function(table, columnId) {
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

    FlowsqlBrowser.prototype.insertOne = function(table, item) {
  this.trace("insertOne");
  const insertedIds = this._insertMany(table, [item], "insertOne");
  return insertedIds[0];
};
    FlowsqlBrowser.prototype.insertMany = function(table, rows) {
  this.trace("insertMany");
  this.assertion(typeof table === "string", "Parameter «table» must be a string on «insertMany»");
  this.assertion(Array.isArray(rows), "Parameter «rows» must be an array on «insertMany»");
  return this._insertMany(table, rows, "insertMany");
};
    FlowsqlBrowser.prototype.selectOne = function(table, id) {
  this.trace("selectOne");
  const allMatches = this._selectMany(table, [["id", "=", id]], "selectOne");
  return allMatches[0] || null;
};
    FlowsqlBrowser.prototype.selectMany = function(table, filters = []) {
  this.trace("selectMany");
  return this._selectMany(table, filters, "selectMany");
};
    FlowsqlBrowser.prototype.selectByLabel = function(table, label) {
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
    FlowsqlBrowser.prototype.updateOne = function(table, id, values) {
  this.trace("updateOne");
  const modifiedIds = this._updateMany(table, [["id", "=", id]], values, "updateOne");
  return modifiedIds[0];
};
    FlowsqlBrowser.prototype.updateMany = function(table, filters, values) {
  this.trace("updateMany");
  this.assertion(typeof table === "string", "Parameter «table» must be a string on «updateMany»");
  this.assertion((typeof filters === "undefined") || Array.isArray(filters), "Parameter «filters» must be an array on «updateMany»");
  this.assertion(typeof values === "object", "Parameter «values» must be an object on «updateMany»");
  return this._updateMany(table, filters, values, "updateMany");
};
    FlowsqlBrowser.prototype.updateByLabel = function(table, label, values) {
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
    FlowsqlBrowser.prototype.deleteOne = function(table, id) {
  this.trace("deleteOne");
  return this._deleteMany(table, [["id", "=", id]], "deleteOne");
};
    FlowsqlBrowser.prototype.deleteMany = function(table, filters) {
  this.trace("deleteMany");
  return this._deleteMany(table, filters, "deleteMany");
};
    FlowsqlBrowser.prototype.deleteByLabel = function(table, label) {
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

    window.FlowsqlBrowser = FlowsqlBrowser;

})()