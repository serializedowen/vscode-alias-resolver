const parse = require("./babelParser");
const vscode = require("vscode");
const fs = require("fs");
const searchReplace = require("./searchReplace");

const definitionProvider = mapping => {
  return {
    provideDefinition: (document, position, token) => {
      const line = document.lineAt(position);

      try {
        const path = parse(line, document.languageId);
        const newPath = searchReplace(mapping, path);

        if (fs.existsSync(newPath)) {
          return new vscode.Location(
            vscode.Uri.file(newPath),
            new vscode.Position(0, 0)
          );
        } else {
          throw new Error("File doesn't exist!");
        }
      } catch (e) {
        console.log(e);
        return;
      }
    }
  };
};
module.exports = definitionProvider;
