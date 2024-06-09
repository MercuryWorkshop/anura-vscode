import * as fs from "fs"
import * as fse from "fs-extra"
import archiver from "archiver"

if (fs.existsSync("out")) {
  fs.rmdirSync("out", { recursive: true });
}

fs.mkdirSync("out");

fs.mkdirSync("out/vscode");

fse.copySync("dist", "out/vscode/");
fse.copySync("templates/manifest.json", "out/manifest.json");

fs.readFile("out/manifest.json", (err, data) => {
  if (err) throw err;
  const manifest = JSON.parse(data);
  const output = fs.createWriteStream(
    `out/${manifest.package}.app.zip`
  );
  const archive = archiver("zip", {
    zlib: { level: 0 },
  });
  output.on("close", () => {
    console.log("Finished building anuraOS app package: " + manifest.package);
    console.log(archive.pointer() + " total bytes");
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      console.warn(err);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    throw err;
  });

  archive.pipe(output);

  archive.directory("out/", false);

  archive.finalize();
});