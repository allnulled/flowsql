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

  const filesystem1 = flowsql.createFileSystem("Database_files");
  assertion(typeof filesystem1 === "object", "«filesystem1» must be an object");
  filesystem1.writeFile("fichero1.txt", "Contenido!");
  filesystem1.writeDirectory("folder1");
  filesystem1.writeDirectory("folder1/carpeta1");
  const list1 = filesystem1.readDirectory("/");
  assertion(Array.isArray(list1), "«list1» must be an array");
  assertion(list1.length === 2, "«list1.length» must be 2");
  const content1 = filesystem1.readFile("/fichero1.txt");
  assertion(typeof content1 === "string", "«content1» must be a string");
  assertion(content1 === "Contenido!", "«content1» must be 'Contenido!'");
  filesystem1.removeFile("/fichero1.txt");
  filesystem1.removeDirectory("/folder1");
  const list2 = filesystem1.readDirectory("/");
  assertion(Array.isArray(list2), "«list2» must be an array");
  assertion(list2.length === 0, "«list2.length» must be 0");
  const list3 = filesystem1.readDirectory("/folder1");
  assertion(Array.isArray(list3), "«list3» must be an array");
  assertion(list3.length === 1, "«list3.length» must be 1");
  assertion(list3[0].node_path === "/folder1/carpeta1", "«list3[0].node_path» must be '/folder1/carpeta1'");
  filesystem1.renameDirectory("/folder1/carpeta1", "/carpeta0001");
  filesystem1.writeFile("/folder1/fichero1.txt", "ok");
  filesystem1.renameFile("/folder1/fichero1.txt", "/fichero0001.txt");
  const list4 = filesystem1.readDirectory("/");
  assertion(Array.isArray(list4), "«list4» must be an array");
  assertion(list4.length === 2, "«list4.length» must be 2");

  console.log("[*] Completed test: 006.file-system api");
};