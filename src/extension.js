const mapping = {
  "@/": "/Users/OwenWang/Documents/alias-resolver/"
};

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// const symbol = require("./symbols");
const definitionProviderFactory = require("./definitionProvider");
const completionItemProviderFactory = require("./completionProvider");
// const settings = require("./settings.json");

const completionItemProvider = completionItemProviderFactory(mapping);

const definitionProvider = definitionProviderFactory(mapping);

// function languageCheck(document) {
//   const { languageId } = document;

//   if (languageId === "javascript" || "javascriptreact") {
//     return symbol.js;
//   } else if (languageId === "typescript") {
//     return symbol.ts;
//   }

//   return "text/plain";
// }

const commands = [];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
exports.activate = function(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "helloworld-sample" is now active!'
  );

  // commands.push(
  //   vscode.commands.registerCommand("extension.testHook", () => {
  //     vscode.window.showInformationMessage("test!");
  //   })
  // );

  commands.push(
    vscode.languages.registerCompletionItemProvider(
      ["javascriptreact", "javascript"],
      completionItemProvider,
      ["/"]
    )
  );

  commands.push(
    vscode.languages.registerDefinitionProvider(
      ["javascriptreact", "javascript"],
      definitionProvider
    )
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  commands.push(
    vscode.commands.registerCommand("extension.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Helloooo World!");
    })
  );

  commands.map(command => context.subscriptions.push(command));
};

// this method is called when your extension is deactivated
exports.deactivate = function(context) {
  commands.map(command => con);
};
