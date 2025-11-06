const path = require("path");

const requireFile = (...pathParts) => require(path.resolve(__dirname, "inc", ...pathParts));

const Flowsql = requireFile("Flowsql", "constructor.js");

Flowsql.create = requireFile("Flowsql", "static", "create.js");
Flowsql.assertion = requireFile("Flowsql", "static", "assertion.js");
Flowsql.AssertionError = requireFile("Flowsql", "static", "AssertionError.js");
Flowsql.defaultOptions = requireFile("Flowsql", "static", "defaultOptions.js");
Flowsql.defaultDatabaseOptions = requireFile("Flowsql", "static", "defaultDatabaseOptions.js");
Flowsql.dependencies = requireFile("Flowsql", "static", "dependencies.js");
Flowsql.escapeId = requireFile("Flowsql", "static", "escapeId.js");
Flowsql.escapeValue = requireFile("Flowsql", "static", "escapeValue.js");
Flowsql.getSqlType = requireFile("Flowsql", "static", "getSqlType.js");
Flowsql.knownTypes = requireFile("Flowsql", "static", "knownTypes.js");
Flowsql.knownOperators = requireFile("Flowsql", "static", "knownOperators.js");
Flowsql.copyObject = requireFile("Flowsql", "static", "copyObject.js");
Flowsql.arrayContainsAnyOf = requireFile("Flowsql", "static", "arrayContainsAnyOf.js");

Flowsql.prototype._ensureBasicMetadata = requireFile("Flowsql", "prototype", "_ensureBasicMetadata.js");
Flowsql.prototype._loadSchema = requireFile("Flowsql", "prototype", "_loadSchema.js");
Flowsql.prototype._persistSchema = requireFile("Flowsql", "prototype", "_persistSchema.js");
Flowsql.prototype._createRelationalTable = requireFile("Flowsql", "prototype", "_createRelationalTable.js");
Flowsql.prototype._validateFilters = requireFile("Flowsql", "prototype", "_validateFilters.js");
Flowsql.prototype._sqlForColumn = requireFile("Flowsql", "prototype", "_sqlForColumn.js");
Flowsql.prototype._sqlForWhere = requireFile("Flowsql", "prototype", "_sqlForWhere.js");
Flowsql.prototype._sqlForInsertInto = requireFile("Flowsql", "prototype", "_sqlForInsertInto.js");
Flowsql.prototype._sqlForInsertValues = requireFile("Flowsql", "prototype", "_sqlForInsertValues.js");
Flowsql.prototype._sqlForUpdateSet = requireFile("Flowsql", "prototype", "_sqlForUpdateSet.js");
Flowsql.prototype._validateInstance = requireFile("Flowsql", "prototype", "_validateInstance.js");
Flowsql.prototype._selectMany = requireFile("Flowsql", "prototype", "_selectMany.js");
Flowsql.prototype._insertMany = requireFile("Flowsql", "prototype", "_insertMany.js");
Flowsql.prototype._updateMany = requireFile("Flowsql", "prototype", "_updateMany.js");
Flowsql.prototype._deleteMany = requireFile("Flowsql", "prototype", "_deleteMany.js");

Flowsql.prototype.assertion = Flowsql.assertion.bind(Flowsql);

Flowsql.prototype.fetchSql = requireFile("Flowsql", "prototype", "fetchSql.js");
Flowsql.prototype.insertSql = requireFile("Flowsql", "prototype", "insertSql.js");
Flowsql.prototype.runSql = requireFile("Flowsql", "prototype", "runSql.js");
Flowsql.prototype.connect = requireFile("Flowsql", "prototype", "connect.js");
Flowsql.prototype.trace = requireFile("Flowsql", "prototype", "trace.js");

Flowsql.prototype.extractSqlSchema = requireFile("Flowsql", "prototype", "extractSqlSchema.js");
Flowsql.prototype.checkSchemaValidity = requireFile("Flowsql", "prototype", "checkSchemaValidity.js");
Flowsql.prototype.addTable = requireFile("Flowsql", "prototype", "addTable.js");
Flowsql.prototype.addColumn = requireFile("Flowsql", "prototype", "addColumn.js");
Flowsql.prototype.renameTable = requireFile("Flowsql", "prototype", "renameTable.js");
Flowsql.prototype.renameColumn = requireFile("Flowsql", "prototype", "renameColumn.js");
Flowsql.prototype.dropTable = requireFile("Flowsql", "prototype", "dropTable.js");
Flowsql.prototype.dropColumn = requireFile("Flowsql", "prototype", "dropColumn.js");

Flowsql.prototype.insertOne = requireFile("Flowsql", "prototype", "insertOne.js");
Flowsql.prototype.insertMany = requireFile("Flowsql", "prototype", "insertMany.js");
Flowsql.prototype.selectOne = requireFile("Flowsql", "prototype", "selectOne.js");
Flowsql.prototype.selectMany = requireFile("Flowsql", "prototype", "selectMany.js");
Flowsql.prototype.selectByLabel = requireFile("Flowsql", "prototype", "selectByLabel.js");
Flowsql.prototype.updateOne = requireFile("Flowsql", "prototype", "updateOne.js");
Flowsql.prototype.updateMany = requireFile("Flowsql", "prototype", "updateMany.js");
Flowsql.prototype.deleteOne = requireFile("Flowsql", "prototype", "deleteOne.js");
Flowsql.prototype.deleteMany = requireFile("Flowsql", "prototype", "deleteMany.js");

module.exports = Flowsql;