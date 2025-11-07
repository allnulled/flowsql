const fs = require("fs");
const path = require("path");

const apiMarkdownFile = path.resolve(__dirname, "docs", "API.md");
const readmeTemplateFile = path.resolve(__dirname, "docs", "README.template.md");
const readmeTemplate = fs.readFileSync(readmeTemplateFile).toString();
const readmeFile = path.resolve(__dirname, "..", "README.md");

const generateMarkdownTOC = function(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  const headers = [];
  const headerRegex = /^(#{1,6})\s+(.*)$/;
  for (const line of lines) {
    const match = line.match(headerRegex);
    if (match) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headers.push({ level, title, id });
    }
  }
  // Construcción jerárquica
  const root = [];
  const stack = [{ children: root, level: 0 }];
  for (const h of headers) {
    while (stack.length > 1 && h.level <= stack[stack.length - 1].level) {
      stack.pop();
    }
    const node = { ...h, children: [] };
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root;
};

const renderTOC = function(toc, indent = 0) {
  return toc
    .map(
      h =>
        `${'   '.repeat(indent)}- [${h.title}](#${h.id})\n` +
        renderTOC(h.children, indent + 1)
    )
    .join('');
};

const generateMarkdownTOCInMarkdown = function(texto) {
  return renderTOC(generateMarkdownTOC(texto));
};

require("@allnulled/javadoc-brute").extractComments({
  include: [path.resolve(__dirname, "..", "flowsql-browser.js")],
  exclude: [
    path.resolve(__dirname, "..", "node_modules", "**/*.js"),
  ],
  output: path.resolve(__dirname, "..", "README-BROWSER.md"),
});

require("@allnulled/javadoc-brute").extractComments({
  include: [path.resolve(__dirname, "..", "flowsql-node.js")],
  exclude: [
    path.resolve(__dirname, "..", "node_modules", "**/*.js"),
  ],
  output: path.resolve(__dirname, "..", "README-NODE.md"),
});
