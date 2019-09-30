const mapping = {
  "@/": vscode => vscode.workspace.rootPath + "/src/"
};

const activatedLanguage = [
  "javascript",
  "typescript",
  "javascriptreact",
  "typescriptreact",
  "vue"
];

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// const symbol = require("./symbols");
const definitionProviderFactory = require("./definitionProvider");
const completionItemProviderFactory = require("./completionProvider");

let isActive = false;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
exports.activate = function(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  const completionItemProvider = completionItemProviderFactory(mapping);
  const definitionProvider = definitionProviderFactory(mapping);

  for (let key in mapping) {
    if (Object.prototype.toString.call(mapping[key]) === "[object Function]") {
      mapping[key] = mapping[key](vscode);
    }
  }

  let commands = [];
  const toggleOn = () => {
    if (!isActive) {
      commands.push(
        vscode.languages.registerCompletionItemProvider(
          activatedLanguage,
          completionItemProvider,
          ["/"]
        )
      );

      commands.push(
        vscode.languages.registerDefinitionProvider(
          activatedLanguage,
          definitionProvider
        )
      );

      commands.map(command => context.subscriptions.push(command));

      isActive = !isActive;
    }
  };

  const toggleOff = () => {
    if (isActive) {
      commands.map(command => command.dispose());
      commands = [];
      isActive = !isActive;
    }
  };

  vscode.window.showInformationMessage(mapping["@/"]);

  const hooks = [];

  hooks.push(
    vscode.commands.registerCommand("extension.toggle", () => {
      // console.log("Turned " + isActive ? "off" : "on");

      new Promise(resolve => {
        isActive ? toggleOff() : toggleOn();
        resolve();
      }).then(
        vscode.window.showInformationMessage(
          `Alias resolver is turned ${isActive ? "on" : "off"}`
        )
      );
    })
  );

  // hooks.push("extension.enable", () => {});

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  hooks.push(
    vscode.commands.registerCommand("extension.helloWorld", () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Helloooo World!");
    })
  );

  hooks.map(hook => context.subscriptions.push(hook));

  toggleOn();

  console.log(
    'Congratulations, your extension "alias-resolver" is now active!'
  );
};

// this method is called when your extension is deactivated
exports.deactivate = function() {};
