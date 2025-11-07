module.exports = async function (Flowsql) {
  require("fs").unlinkSync(__dirname + "/test.sqlite");
  const assertion = Flowsql.assertion.bind(Flowsql);
  const flowsql = Flowsql.create({ filename: __dirname + "/test.sqlite", trace: false, traceSql: false });

  Add_table: {
    flowsql.addTable("Table_1", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, label: true },
      }
    });
    flowsql.addTable("Table_2", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, label: true },
      }
    });
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
        objRefType: { type: "object-reference", referredTable: "Table_1" },
        arrRefType: { type: "array-reference", referredTable: "Table_2" },
        uniqueColumn: { type: "string", unique: true },
        nullableColumn: { type: "string", nullable: true },
        defaultSqlColumn: { type: "string", defaultBySql: "'none'" },
        unmodifiedColumn: { type: "string" },
      }
    });
    flowsql.addTable("Table_4_droppable", {
      columns: {
        droppableColumn1: { type: "string" },
        arrRefType3: { type: "array-reference", referredTable: "Table_1" },
        arrRefType4: { type: "array-reference", referredTable: "Table_1" }
      }
    });
    flowsql.addTable("Table_5", {
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
        objRefType: { type: "object-reference", referredTable: "Table_1" },
        arrRefType: { type: "array-reference", referredTable: "Table_2" },
        uniqueColumn: { type: "string", unique: true },
        nullableColumn: { type: "string", nullable: true },
        defaultSqlColumn: { type: "string", defaultBySql: "'none'" },
        unmodifiedColumn: { type: "string" },
      }
    });
    assertion(typeof flowsql.$schema.tables.Table_1 === "object", "Parameter «flowsql.$schema.tables.Table_1» must be object here");
    assertion(typeof flowsql.$schema.tables.Table_2 === "object", "Parameter «flowsql.$schema.tables.Table_2» must be object here");
    assertion(typeof flowsql.$schema.tables.Table_3 === "object", "Parameter «flowsql.$schema.tables.Table_3» must be object here");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable === "object", "Parameter «flowsql.$schema.tables.Table_4_droppable» must be object here");
    // Query to schema 1:
    const sqlSchema1 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema1.tables.Database_metadata === "object", "Parameter «sqlSchema1.tables.Database_metadata» must be object here");
    assertion(typeof sqlSchema1.tables.Rel_x_Table_3_x_arrRefType === "object", "Parameter «sqlSchema1.tables.Rel_x_Table_3_x_arrRefType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_1 === "object", "Parameter «sqlSchema1.tables.Table_1» must be object here");
    assertion(typeof sqlSchema1.tables.Table_2 === "object", "Parameter «sqlSchema1.tables.Table_2» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3 === "object", "Parameter «sqlSchema1.tables.Table_3» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.booleanType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.booleanType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.integerType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.integerType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.realType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.realType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.textType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.textType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.stringType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.stringType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.blobType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.blobType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.dateType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.dateType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.datetimeType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.datetimeType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.objectType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.objectType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.arrayType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.arrayType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.objRefType === "object", "Parameter «sqlSchema1.tables.Table_3.columns.objRefType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.arrRefType === "undefined", "Parameter «sqlSchema1.tables.Table_3.columns.arrRefType» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.uniqueColumn === "object", "Parameter «sqlSchema1.tables.Table_3.columns.uniqueColumn» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.nullableColumn === "object", "Parameter «sqlSchema1.tables.Table_3.columns.nullableColumn» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.defaultSqlColumn === "object", "Parameter «sqlSchema1.tables.Table_3.columns.defaultSqlColumn» must be object here");
    assertion(typeof sqlSchema1.tables.Table_3.columns.unmodifiedColumn === "object", "Parameter «sqlSchema1.tables.Table_3.columns.unmodifiedColumn» must be object here");
    assertion(typeof sqlSchema1.tables.Rel_x_Table_3_x_arrRefType2 === "undefined", "Parameter «sqlSchema1.tables.Rel_x_Table_3_x_arrRefType2» must be object here");
    assertion(typeof sqlSchema1.tables.Table_4_droppable.columns.droppableColumn1 === "object", "Parameter «sqlSchema1.tables.Table_4_droppable.columns.droppableColumn1» must be object here");
    assertion(typeof sqlSchema1.tables.Rel_x_Table_4_droppable_x_arrRefType3 === "object", "Parameter «sqlSchema1.tables.Rel_x_Table_4_droppable_x_arrRefType3» must be object here");
  }

  Add_column: {
    flowsql.addColumn("Table_3", "arrRefType2", {
      type: "array-reference",
      referredTable: "Table_2"
    });
    // Query to schema 2:
    const sqlSchema2 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema2.tables.Rel_x_Table_3_x_arrRefType2 === "object");
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

    flowsql.dropColumn("Table_4_droppable", "arrRefType4");
    // Query to schema 5:
    const sqlSchema5 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema5.tables.Rel_x_Table_4_droppable_x_arrRefType4 === "undefined", "El nombre de la tabla relacional debió haber desaparecido en el SQL");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable.columns.arrRefType4 === "undefined", "El nombre de la columna relacional debió haber desaparecido en el $schema");
  }

  Drop_table: {
    flowsql.dropTable("Table_4_droppable");
    // Query to schema 6:
    const sqlSchema6 = flowsql.extractSqlSchema();
    assertion(typeof sqlSchema6.tables.Table_4_droppable === "undefined", "El nombre de la tabla debió haber desaparecido en el SQL");
    assertion(typeof flowsql.$schema.tables.Table_4_droppable === "undefined", "El nombre de la tabla debió haber desaparecido en el $schema");
    assertion(typeof sqlSchema6.tables.Rel_x_Table_4_droppable_x_arrRefType3 === "undefined", "El nombre de la tabla relacional debió haber desaparecido");
  }

  Default_by_js: {
    const insertId1 = flowsql.insertOne("Table_1_modificada", {
      name: "unit 1.1"
    });
    const insertId2 = flowsql.insertOne("Table_2", {
      name: "unit 2.1"
    });
    const insertId3 = flowsql.insertOne("Table_2", {
      name: "unit 2.2"
    });
    const insertIds = flowsql.insertMany("Table_2", [{
      name: "unit 2.3"
    }, {
      name: "unit 2.4"
    }, {
      name: "unit 2.5"
    }]);
    assertion(insertIds[0] === 3, "Parameter insertIds[0] must be 3 here");
    assertion(insertIds[1] === 4, "Parameter insertIds[0] must be 3 here");
    assertion(insertIds[2] === 5, "Parameter insertIds[0] must be 3 here");
    //*
    flowsql.insertMany("Table_5", [{
      booleanType: true,
      integerType: 1,
      realType: 1.05,
      textType: "one",
      stringType: "one",
      blobType: "",
      dateType: "2025/11/06",
      datetimeType: "2025/11/06 20:56:00",
      objectType: JSON.stringify({}),
      arrayType: JSON.stringify([]),
      objRefType: insertId1,
      arrRefType: [insertId2, insertId3],
      uniqueColumn: 1,
      nullableColumn: null,
      defaultSqlColumn: "none",
      unmodifiedColumn: 1,
      /*
      arrRefType2: [insertId2],
      //*/
    }]);
    //*/
  }

  console.log("[*] Completed test: 001.schema alters and datatypes");
};