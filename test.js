const fs = require("fs");
const path = require("path");
const Flowsql = require(path.resolve(__dirname, "flowsql-node.js"));

const testDirectory = path.resolve(__dirname, "test-node");
const testFolders = fs.readdirSync(testDirectory);

const main = async function () {
  try {
    for (let indexTest = 0; indexTest < testFolders.length; indexTest++) {
      const testFolder = testFolders[indexTest];
      const testFolderPath = path.resolve(testDirectory, testFolder);
      const testPath = path.resolve(testDirectory, testFolder, "test.js");
      process.chdir(testFolderPath);
      const testCallback = require(testPath);
      await testCallback(Flowsql);
    }
  } catch (error) {
    console.log(`Error en el test de la carpeta:\n${process.cwd()}`);
    console.log(error);
    throw error;
  }
};

module.exports = main();