module.exports = async function (Flowsql) {

  const assertion = Flowsql.assertion.bind(Flowsql);

  const resetDatabase = function () {
    require("fs").unlinkSync(__dirname + "/test.sqlite");
    const flowsql = Flowsql.create({ filename: __dirname + "/test.sqlite", trace: true, traceSql: true });
    flowsql.addTable("User", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, nullable: false },
        email: { type: "string", maxLength: 255, unique: true, nullable: false },
        password: { type: "string", maxLength: 255, nullable: false },
        description: { type: "string", maxLength: 255, default: "'none'", nullable: true }
      }
    });
    flowsql.addTable("Permission", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, nullable: false },
        description: { type: "string", maxLength: 255, unique: true, nullable: true },
      }
    });
    flowsql.addTable("Group", {
      columns: {
        name: { type: "string", maxLength: 255, unique: true, nullable: false },
        description: { type: "string", maxLength: 255, unique: true, nullable: false },
        permissions: { type: "array-reference", referredTable: "Permission" },
      }
    });
    flowsql.addTable("Session", {
      columns: {
        token: { type: "string", maxLength: 100, unique: true, nullable: false },
        user: { type: "object-reference", referredTable: "User", nullable: false },
      }
    });
    return flowsql;
  };

  Testing_select_filters_and_attachments: {

    const flowsql = resetDatabase();

    const user1 = flowsql.insertSql("INSERT INTO `User` (name, email, password) VALUES ('admin', 'admin', 'admin@mail.com');");
    const user2 = flowsql.insertSql("INSERT INTO `User` (name, email, password) VALUES ('user1', 'user1', 'user1@mail.com');");
    const user3 = flowsql.insertSql("INSERT INTO `User` (name, email, password) VALUES ('user2', 'user2', 'user2@mail.com');");
    const user4 = flowsql.insertSql("INSERT INTO `User` (name, email, password) VALUES ('user3', 'user3', 'user3@mail.com');");

    const group1 = flowsql.insertSql("INSERT INTO `Group` (name, description) VALUES ('administrators', 'who administrates');");
    const group2 = flowsql.insertSql("INSERT INTO `Group` (name, description) VALUES ('advanced navigators', 'who navigates with advanced permissions');");

    const permission1 = flowsql.insertSql("INSERT INTO `Permission` (name, description) VALUES ('to administrate', 'permission to administrate');");
    const permission2 = flowsql.insertSql("INSERT INTO `Permission` (name, description) VALUES ('to navigate with advanced permissions', 'permission to navigate with advanced permissions');");

    flowsql.insertSql("INSERT INTO `Rel_x_Group_x_permissions` (id_source, id_destination) VALUES (1, 1);");
    flowsql.insertSql("INSERT INTO `Rel_x_Group_x_permissions` (id_source, id_destination) VALUES (1, 2);");
    flowsql.insertSql("INSERT INTO `Rel_x_Group_x_permissions` (id_source, id_destination) VALUES (2, 2);");

    const allGroups0 = flowsql.selectMany("Group");

    assertion(allGroups0[0].permissions.length === 2, "allGroups0[0].permissions.length must be 2 here");
    assertion(allGroups0[0].permissions[0] === 1, "allGroups0[0].permissions[0] must be 1 here");
    assertion(allGroups0[0].permissions[1] === 2, "allGroups0[0].permissions[1] must be 2 here");

    const allGroups1 = flowsql.selectMany("Group", [["name", "=", "administrators"]]);

    assertion(allGroups1.length === 1, "allGroups1.length must be 1 here");
    assertion(allGroups1[0].name === "administrators", "allGroups1[0].name must be administrators here");

    const allGroups2 = flowsql.selectMany("Group", [["name", "!=", "administrators"]]);

    assertion(allGroups2.length === 1, "allGroups2.length must be 1 here");
    assertion(allGroups2[0].name === "advanced navigators", "allGroups2[0].name must be advanced navigators here");

    const allGroups3 = flowsql.selectMany("Group", [["permissions", "has", permission1]]);

    assertion(allGroups3.length === 1, "allGroups3.length must be 1 here");
    assertion(allGroups3[0].name === "administrators", "allGroups3[0].name must be administrators here");

    const allGroups4 = flowsql.selectMany("Group", [["permissions", "has", [permission1]]]);

    assertion(allGroups4.length === 1, "allGroups4.length must be 1 here");
    assertion(allGroups4[0].name === "administrators", "allGroups4[0].name must be administrators here");

    const oneGroup1 = flowsql.selectOne("Group", group1);
    const oneGroup2 = flowsql.selectOne("Group", group2);

    assertion(oneGroup1.name === "administrators", "oneGroup1.name must be administrators here");
    assertion(oneGroup2.name === "advanced navigators", "oneGroup2.name must be advanced navigators here");

  }

  const startMoment = new Date();

  Testing_insert_one_and_many: {


    const flowsql = resetDatabase();

    flowsql.insertOne("User", {
      name: "admin",
      password: "admin",
      email: "admin@mail.com"
    });

    flowsql.insertMany("User", [{
      name: "user1",
      password: "user1",
      email: "user1@mail.com",
    }, {
      name: "user2",
      password: "user2",
      email: "user2@mail.com",
    }, {
      name: "user3",
      password: "user3",
      email: "user3@mail.com",
    }]);

    const allUsers = flowsql.selectMany("User", []);

    assertion(allUsers.length === 4, "allUsers.length must be 4 here");
    assertion(allUsers[0].name === 'admin', "allUsers[0].name must be 'admin' here");
    assertion(allUsers[1].name === 'user1', "allUsers[0].name must be 'user1' here");
    assertion(allUsers[2].name === 'user2', "allUsers[0].name must be 'user2' here");
    assertion(allUsers[3].name === 'user3', "allUsers[0].name must be 'user3' here");

    Relational_case: {

      const permission1 = flowsql.insertOne("Permission", { name: "to administrate" });
      const permission2 = flowsql.insertOne("Permission", { name: "to navigate" });
      const permission3 = flowsql.insertOne("Permission", { name: "to view" });

      flowsql.insertOne("Group", {
        name: "administrators",
        description: "who administrates",
        permissions: [permission1, permission2, permission3]
      });

      const allGroups = flowsql.selectMany("Group");

      assertion(allGroups.length === 1, "allGroups.length must be 1 here");

    }



  }

  /*/

  flowsql.insertOne("User", {
    name: "admin",
    password: "admin",
    email: "admin@mail.com",
  });
  flowsql.insertMany("User", [{
    name: "user1",
    password: "user1",
    email: "user1@mail.com",
  }, {
    name: "user2",
    password: "user2",
    email: "user2@mail.com",
  }, {
    name: "user3",
    password: "user3",
    email: "user3@mail.com",
  }]);

  const allUsers1 = flowsql.selectMany("User", []);
  
  assertion(Array.isArray(allUsers1), "allUsers1 must be an array here");
  assertion(allUsers1.length === 4, "allUsers1.length must be 4 here");
  
  flowsql.updateOne("User", 2, { name: "user001" });

  const modifiedUser1 = flowsql.selectOne("User", 2);

  assertion(modifiedUser1.name === "user001", "modifiedUser1.name must be 'user001' here");

  flowsql.updateMany("User", [
    ["name", "is like", "user%"]
  ], {
    description: "No description"
  });

  const allUsers2 = flowsql.selectMany("User", []);

  assertion(allUsers2[1].name === "No description", "allUsers2[1].name must be 'No description' here");
  assertion(allUsers2[2].name === "No description", "allUsers2[2].name must be 'No description' here");
  assertion(allUsers2[3].name === "No description", "allUsers2[3].name must be 'No description' here");

  flowsql.deleteOne("User", 2);

  const allUsers3 = flowsql.selectMany("User", []);

  assertion(allUsers3.length === 3, "allUsers3.length must be 3 here");

  flowsql.deleteMany("User", [
    ["name", "is like", "user%"]
  ]);

  const allUsers4 = flowsql.selectMany("User", []);

  assertion(allUsers4.length === 1, "allUsers4.length must be 1 here");

  //*/

  console.log("[*] Completed test: 002.crud operations");
};