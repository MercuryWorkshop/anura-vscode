const url = (
  import.meta.url.substring(0, import.meta.url.lastIndexOf("/")) +
  "/${VERSION}/"
).split(window.location.origin)[1];

export default function install(anura) {
  if (!url.startsWith("/fs")) {
    anura.notifications.add({
      title: "Anura VSCode",
      description: `Error: Anura VSCode extension library installed statically. Please install the extension to the filesystem via the Workstore app.`,
      timeout: 5000,
    });
    return;
  }
  const path = url.split("/fs")[1];

  const destination = "/vscode-ext";

  anura.fs.exists(destination, (exists) => {
    if (!exists) {
      anura.fs.mkdir(destination);

      anura.fs.readFile(path + "/package.json", (err, data) => {
        if (err) throw err;
        anura.fs.writeFile(destination + "/package.json", data, (err) => {
          if (err) throw err;
        });
      });

      anura.fs.readFile(path + "/package.nls.json", (err, data) => {
        if (err) throw err;
        anura.fs.writeFile(destination + "/package.nls.json", data, (err) => {
          if (err) throw err;
        });
      });

      anura.fs.mkdir(destination + "/dist");

      anura.fs.readFile(path + "/dist/extension.js", (err, data) => {
        if (err) throw err;
        anura.fs.writeFile(destination + "/dist/extension.js", data, (err) => {
          if (err) throw err;
        });
      });

      anura.fs.readFile(path + "/dist/extension.js.map", (err, data) => {
        if (err) throw err;
        anura.fs.writeFile(
          destination + "/dist/extension.js.map",
          data,
          (err) => {
            if (err) throw err;
          }
        );
      });
    }
  });
}
