const fs = require("fs");
const fse = require("fs-extra");

const { version } = JSON.parse(fs.readFileSync("extension/package.json"));

const outputBasePath = "out_extension";

let hasPrevious = true;

if (process.env.RESET) {
  hasPrevious = false;
  fs.rmdirSync(outputBasePath, { recursive: true });
}

if (!fs.existsSync(outputBasePath)) {
  hasPrevious = false;
  fs.mkdirSync(outputBasePath);
}

if (!fs.existsSync(`${outputBasePath}/versions`)) {
  fs.mkdirSync(`${outputBasePath}/versions`);
}

const versionedBasePath = `${outputBasePath}/versions/v${version.replace(
  /\./g,
  "_"
)}`;

if (!fs.existsSync(versionedBasePath)) {
  fs.mkdirSync(versionedBasePath);
}

const files = [
  ["extension/package.json", versionedBasePath + "/package.json"],
  ["extension/package.nls.json", versionedBasePath + "/package.nls.json"],
  ["extension/dist", versionedBasePath + "/dist"],
];

files.forEach(([src, dest]) => {
  fse.copySync(src, dest);
});

const manifest = JSON.parse(
  hasPrevious
    ? fs.readFileSync(`${outputBasePath}/manifest.json`, "utf8")
    : fs.readFileSync("templates/lib-manifest-template.json", "utf8")
);

manifest.versions[version] =
  "versions/v" + version.replace(/\./g, "_") + "-install.js";

fs.writeFileSync(`${outputBasePath}/manifest.json`, JSON.stringify(manifest));

const installScript = fs
  .readFileSync("templates/versioned_install.js", "utf8")
  .replace("${VERSION}", "v" + version.replace(/\./g, "_"));

fs.writeFileSync(`${versionedBasePath}-install.js`, installScript, "utf8");

fs.writeFileSync(
  `${outputBasePath}/install.js`,
  fs
    .readFileSync("templates/base_install.js", "utf8")
    .replace("${LATEST_VERSION}", "v" + version.replace(/\./g, "_")),
  "utf8"
);
