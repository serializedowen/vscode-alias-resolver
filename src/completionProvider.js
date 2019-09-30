const parse = require("./babelParser");
const vscode = require("vscode");
const fs = require("fs");
const searchReplace = require("./searchReplace");

module.exports = mapping => {
  function provideCompletionItems(document, position, token, context) {
    const line = document.lineAt(position);
    try {
      const path = parse(line, document.languageId);
      const newPath = searchReplace(mapping, path);
      const directory = newPath.substr(0, newPath.lastIndexOf("/"));
      const toComplete = newPath.substr(newPath.lastIndexOf("/") + 1);
      const dirents = fs.readdirSync(directory, {
        encoding: "utf8",
        withFileTypes: true
      });

      return dirents
        .filter(dirent => dirent.name.startsWith(toComplete))
        .map(dirent => {
          return new vscode.CompletionItem(
            dirent.isFile() ? dirent.name : dirent.name + "/",
            dirent.isFile()
              ? vscode.CompletionItemKind.File
              : vscode.CompletionItemKind.Folder
          );
        });
    } catch (e) {
      console.log(e);
    }
  }

  function resolveCompletionItem(item, token) {
    return null;
  }

  return {
    provideCompletionItems,
    resolveCompletionItem
  };
};
