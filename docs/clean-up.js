import fs from "fs";
import {glob} from "glob";

const files = glob.sync("assets/**/*.*");
let html = fs.readFileSync("index.html", "utf8");
html += fs.readFileSync("design/design.html", "utf8");
html += fs.readFileSync("output.css", "utf8");

files.forEach(file => {
  if (!html.includes(file.replace("docs/", ""))) {
    console.log("Unused:", file);
  }
});
