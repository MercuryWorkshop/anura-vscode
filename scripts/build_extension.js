import process from "process"
import child_process from "child_process"
import fs from "fs"
import fse from "fs-extra"

process.chdir("extension");

if (!fs.existsSync("node_modules")) {
    child_process.execSync("yarn", { stdio: "inherit" });
}

child_process.execSync("yarn run compile", { stdio: "inherit" });
fse.copySync("package.json", "./dist/package.json")
fse.copySync("package.nls.json", "./dist/package.nls.json")