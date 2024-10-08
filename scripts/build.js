import process from "process"
import child_process from "child_process"
import fs from "fs"
import fse from "fs-extra"

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
    // fs.rmdirSync("vscode", { recursive: true, force: true })
    child_process.execSync(`git clone --depth 1 https://github.com/microsoft/vscode.git -b ${vscodeVersion}`, {
      stdio: "inherit",
    });
  }

  process.chdir("vscode");

  if (!fs.existsSync("node_modules")) {
    child_process.execSync("yarn", { stdio: "inherit" });
  }
  
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