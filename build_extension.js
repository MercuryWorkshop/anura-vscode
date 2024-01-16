const process = require("process");
const child_process = require("child_process");
const fs = require("fs");
const fse = require("fs-extra");

process.chdir("extension");

if (!fs.existsSync("node_modules")) {
    child_process.execSync("yarn", { stdio: "inherit" });
}

child_process.execSync("yarn webpack-cli --config extension.webpack.config --mode production", { stdio: "inherit" });
fse.copySync("package.json", "./dist/package.json")
fse.copySync("package.nls.json", "./dist/package.nls.json")