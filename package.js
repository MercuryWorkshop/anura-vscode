const fs = require("fs");
const fse = require("fs-extra");

if (fs.existsSync("out")) {
  fs.rmdirSync("out", { recursive: true });
}

fs.mkdirSync("out");

fs.mkdirSync("out/vscode");

fse.copySync("dist", "out/vscode/");
fse.copySync("templates/manifest.json", "out/manifest.json");
