module.exports = async function (Flowsql) {

  const assertion = Flowsql.assertion.bind(Flowsql);

  const resetDatabase = function () {
    require("fs").unlinkSync(__dirname + "/test.sqlite");
    const flowsql = Flowsql.create({ filename: __dirname + "/test.sqlite", trace: false, traceSql: false });
    flowsql.addTable("User", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, nullable: false, label: true },
        email: { type: "string", maxLength: 255, unique: true, nullable: false },
        password: { type: "string", maxLength: 255, nullable: false },
        description: { type: "string", maxLength: 255, default: "'none'", nullable: true }
      }
    });
    flowsql.addTable("Permission", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, nullable: false, label: true },
        description: { type: "string", maxLength: 255, unique: true, nullable: true },
      }
    });
    flowsql.addTable("Group", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, nullable: false, label: true },
        description: { type: "string", maxLength: 255, unique: true, nullable: false },
        permissions: { type: "array-reference", referredTable: "Permission" },
      }
    });
    flowsql.addTable("Session", {
      columns: {
        token: { type: "string", maxLength: 100, unique: true, nullable: false, label: true },
        user: { type: "object-reference", referredTable: "User", nullable: false },
      }
    });
    return flowsql;
  };

  const flowsql = resetDatabase();

  flowsql._ensureBasicMetadata();

  flowsql.insertMany("Permission", [{
    name: "Permiso 1"
  }, {
    name: "Permiso 2"
  }, {
    name: "Permiso 3"
  }]);

  flowsql.insertMany("Group", [{
    name: "grupo 1",
    description: "Grupo número 1",
    // permissions: [1,2,3]
  }, {
    name: "grupo 2",
    description: "Grupo número 2",
    permissions: []
  }]);

  flowsql.deleteMany("Group", [
    ["id", "=", 1]
  ]);

  const groups1 = flowsql.selectMany("Group", [
    ["permissions", "has not", 1]
  ]);

  console.log("[*] Completed test: 003.fulfill coverage");
};