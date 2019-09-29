const t = require("@babel/types");
const jsParse = require("@babel/parser").parse;
const TYPESCRIPT = require("./symbols").ts;
const traverse = require("@babel/traverse").default;

const PARSE_PLUGINS = [
  "jsx",
  "asyncFunctions",
  "classConstructorCall",
  "doExpressions",
  "trailingFunctionCommas",
  "objectRestSpread",
  ["decorators", { decoratorsBeforeExport: true }],
  "classProperties",
  "exportExtensions",
  "exponentiationOperator",
  "asyncGenerators",
  "functionBind",
  "functionSent",
  "dynamicImport"
];
const PARSE_JS_PLUGINS = ["flow", ...PARSE_PLUGINS];
const PARSE_TS_PLUGINS = ["typescript", ...PARSE_PLUGINS];

/**
 *  Determine if a code fragement is a valid import/require statement
 *  and if so, returns the package string associated with it.
 * @param {string} source
 * @param {string} language
 */
const getPackage = function(source, language) {
  const ast = parse(source.text, language);
  let packageString;

  const visitor = {
    ImportDeclaration({ node }) {
      packageString = node.source.value;
    },

    CallExpression({ node }) {
      if (node.callee.name === "require") {
        packageString = getPackageName(node);
      } else if (node.callee.type === "Import") {
        packageString = getPackageName(node);
      }
    }
  };

  traverse(ast, visitor);

  if (packageString) {
    return packageString;
  } else {
    throw new Error("Not an import/require statement");
  }
};

function parse(source, language) {
  const plugins = language === TYPESCRIPT ? PARSE_TS_PLUGINS : PARSE_JS_PLUGINS;
  return jsParse(source, {
    sourceType: "module",
    plugins
  });
}

function getPackageName(node) {
  return t.isTemplateLiteral(node.arguments[0])
    ? node.arguments[0].quasis[0].value.raw
    : node.arguments[0].value;
}

module.exports = getPackage;
