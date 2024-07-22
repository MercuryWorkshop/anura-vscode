const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");

const app = express();
app.use("/fs/vscode-ext", express.static(path.join(__dirname, "extension")));
app.use(serveStatic("./dist"));
app.listen(8080);
console.log("Listening on port 8080");