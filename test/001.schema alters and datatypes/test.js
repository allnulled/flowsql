module.exports = async function (Flowsql) {
  require("fs").unlinkSync(__dirname + "/test.sqlite");
  const assertion = Flowsql.assertion.bind(Flowsql);
  const flowsql = Flowsql.create({ filename: __dirname + "/test.sqlite", trace: false, traceSql: false });

  Add_table: {
    flowsql.addTable("Table_1", { columns: {} });
    flowsql.addTable("Table_2", { columns: {} });
    flowsql.addTable("Table_3", {
      columns: {
        booleanType: { type: "boolean" },
        integerType: { type: "integer" },
        realType: { type: "real" },
        textType: { type: "string" },
        stringType: { type: "string", maxLength: 255 },
        blobType: { type: "blob" },
        dateType: { type: "date" },
        datetimeType: { type: "datetime" },
        objectType: { type: "object" },
        arrayType: { type: "array" },
        objectReferenceType: { type: "object-reference", referredTable: "Table_1" },
        arrayReferenceType: { type: "array-reference", referredTable: "Table_2" },
        uniqueColumn: { type: "string", unique: true },
        nullableColumn: { type: "string", nullable: true },
        defaultSqlColumn: { type: "string", defaultBySql: "'none'" },
        unmodifiedColumn: { type: "string" },
      }
    });
    flowsql.addTable("Table_4_droppable", {
      columns: {
        droppableColumn1: { type: "string" },
        arrayReferenceType3: { type: "array-reference", referredTable: "Table_1" },
        arrayReferenceType4: { type: "array-reference", referredTable: "Table_1" }
      }
    });
    assertion(typeof flowsql.$schema.tables.Table_1 === "object");
    assertion(typeof flowsql.$schema.tables.Table_2 === "object");
    assertion(typeof flowsql.$schema.tables.Table_3 === "object");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable === "object");
    // Query to schema 1:
    const sqlSchema1 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema1.tables.Database_metadata === "object");
    assertion(typeof sqlSchema1.tables.Rel_x_Table_3_x_arrayReferenceType === "object");
    assertion(typeof sqlSchema1.tables.Table_1 === "object");
    assertion(typeof sqlSchema1.tables.Table_2 === "object");
    assertion(typeof sqlSchema1.tables.Table_3 === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.booleanType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.integerType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.realType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.textType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.stringType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.blobType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.dateType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.datetimeType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.objectType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.arrayType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.objectReferenceType === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.arrayReferenceType === "undefined");
    assertion(typeof sqlSchema1.tables.Table_3.columns.uniqueColumn === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.nullableColumn === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.defaultSqlColumn === "object");
    assertion(typeof sqlSchema1.tables.Table_3.columns.unmodifiedColumn === "object");
    assertion(typeof sqlSchema1.tables.Rel_x_Table_3_x_arrayReferenceType2 === "undefined");
    assertion(typeof sqlSchema1.tables.Table_4_droppable.columns.droppableColumn1 === "object");
    assertion(typeof sqlSchema1.tables.Rel_x_Table_4_droppable_x_arrayReferenceType3 === "object");
  }

  Add_column: {
    flowsql.addColumn("Table_3", "arrayReferenceType2", {
      type: "array-reference",
      referredTable: "Table_2"
    });
    // Query to schema 2:
    const sqlSchema2 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema2.tables.Rel_x_Table_3_x_arrayReferenceType2 === "object");
  }

  Rename_table_and_column: {
    flowsql.renameTable("Table_1", "Table_1_modificada");
    flowsql.renameColumn("Table_3", "unmodifiedColumn", "modifiedColumn");
    // Query to schema 3:
    const sqlSchema3 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema3.tables.Table_1_modificada === "object", "El nombre de la tabla debió modificarse");
    assertion(typeof sqlSchema3.tables.Table_3.columns.modifiedColumn === "object", "El nombre de la columna debió modificarse");
  }

  Drop_column: {
    flowsql.dropColumn("Table_4_droppable", "droppableColumn1");
    // Query to schema 4:
    const sqlSchema4 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema4.tables.Table_4_droppable.columns.droppableColumn1 === "undefined", "El nombre de la columna debió haber desaparecido en el SQL");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable.columns.droppableColumn1 === "undefined", "El nombre de la tabla debió haber desaparecido en el $schema");
    
    flowsql.dropColumn("Table_4_droppable", "arrayReferenceType4");
    // Query to schema 5:
    const sqlSchema5 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema5.tables.Rel_x_Table_4_droppable_x_arrayReferenceType4 === "undefined", "El nombre de la tabla relacional debió haber desaparecido en el SQL");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable.columns.arrayReferenceType4 === "undefined", "El nombre de la columna relacional debió haber desaparecido en el $schema");
  }

  Drop_table: {
    flowsql.dropTable("Table_4_droppable");
    // Query to schema 6:
    const sqlSchema6 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema6.tables.Table_4_droppable === "undefined", "El nombre de la tabla debió haber desaparecido en el SQL");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable === "undefined", "El nombre de la tabla debió haber desaparecido en el $schema");
    assertion(typeof sqlSchema6.tables.Rel_x_Table_4_droppable_x_arrayReferenceType3 === "undefined", "El nombre de la tabla relacional debió haber desaparecido");
  }

  console.log("[*] Completed test: 001.schema alters and datatypes");
};