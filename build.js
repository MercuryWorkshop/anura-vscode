const process = require("process");
const child_process = require("child_process");
const fs = require("fs");
const fse = require("fs-extra");

async function fetchData() {
  try {
    let latestRelease = await fetch(`https://api.github.com/repos/microsoft/vscode/releases/latest`);
    let json = await latestRelease.json();

    return json.tag_name;
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    throw error;
  }
}

async function main() {
  let vscodeVersion;

  try {
    vscodeVersion = await fetchData();
  } catch (error) {
    return;
  }

  if (!fs.existsSync("vscode")) {
    child_process.execSync(`git clone --depth 1 https://github.com/microsoft/vscode.git -b ${vscodeVersion}`, {
      stdio: "inherit",
    });
  }

  process.chdir("vscode");

  if (!fs.existsSync("node_modules")) {
    child_process.execSync("yarn", { stdio: "inherit" });
  }

  fs.copyFileSync(
    "../workbench.ts",
    "src/vs/code/browser/workbench/workbench.ts"
  );

  child_process.execSync("yarn gulp vscode-web-min", { stdio: "inherit" });

  if (fs.existsSync("../dist")) {
    fs.rmdirSync("../dist", { recursive: true });
  }
  fs.mkdirSync("../dist");
  fse.copySync("../index.html", "../vscode-web/index.html")
  fse.copySync("../product.json", "../vscode-web/product.json")
  fse.copySync("../vscode-web", "../dist");
}

main();