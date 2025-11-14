const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

const includeFile = function (subpaths, includeComment = true) {
  const filePath = path.resolve(__dirname, "..", ...subpaths);
  const fileContent = fs.readFileSync(filePath).toString();
  const fileProp = path.basename(filePath).replace(/\.js$/g, "");
  let fileOutput = fileContent.replace(/module\.exports( )*=( )*async( )+function( )*/, "async function");
  fileOutput = fileOutput.replace(/module\.exports( )*=( )*function( )*/, "function");
  fileOutput = fileOutput.replace(/module\.exports( )*=( )*/, "");
  if (includeComment !== true) {
    const r1 = /^[ \t\r\n]*\/\*((?:(?!(\*\/))[\s\S])*)(\*\/)/g;
    fileOutput = fileOutput.replace(r1, "");
  }
  fileOutput = fileOutput.trim();
  return fileOutput;
};

const fabricateFromTemplate = function (templatePath, outputPath) {
  const browserTemplateFile = path.resolve(__dirname, "..", templatePath);
  const mainbrowserTemplate = fs.readFileSync(browserTemplateFile).toString();
  const mainOutput = ejs.render(mainbrowserTemplate, { require, includeFile, fs, path, __dirname: path.resolve(__dirname, ".."), });
  const mainFile = path.resolve(__dirname, "..", outputPath);
  fs.writeFileSync(mainFile, mainOutput, "utf8");
  return [mainFile, mainOutput];
};

Build_parsers: {
  const peggy = require("peggy");
  const firewallPegjsParserPath = path.resolve(__dirname, "..", "inc/FlowsqlFirewall/parser/firewall.pegjs");
  const firewallJsParserPath = path.resolve(__dirname, "..", "inc/FlowsqlFirewall/parser/firewall.js");
  const firewallPegjsParserSource =fs.readFileSync(firewallPegjsParserPath).toString();
  const firewallJsParserSource = peggy.generate(firewallPegjsParserSource, {
    output: "source",
    format: "globals",
    exportVar: "FirewallParser"
  });
  fs.writeFileSync(firewallJsParserPath, firewallJsParserSource, "utf8");
}

Build_templates: {
  const [browserFile, browserContent] = fabricateFromTemplate("flowsql-browser.tmpl.ejs", "flowsql-browser.js");
  const testBrowserOutputPath = path.resolve(__dirname, "..", "test-browser", "flowsql-browser.js");
  fs.writeFileSync(testBrowserOutputPath, browserContent, "utf8");
  fabricateFromTemplate("flowsql-node.tmpl.ejs", "flowsql-node.js");
}