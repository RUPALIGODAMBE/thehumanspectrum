const fs = require("fs");
const path = require("path");

function getFiles(dir, exts, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, exts, fileList);
    } else if (exts.includes(path.extname(file).toLowerCase())) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// 1. Collect assets (images)
const assets = getFiles("docs/assets", [".png", ".jpg", ".jpeg", ".gif", ".svg"]);

// 2. Collect HTML & CSS files
const htmlCssFiles = getFiles("docs", [".html", ".css"]);

const unused = [];

assets.forEach(asset => {
  const name = path.basename(asset);
  const used = htmlCssFiles.some(file => {
    const content = fs.readFileSync(file, "utf8");
    return content.includes(name);
  });
  if (!used) {
    console.log("Unused:", asset);
    unused.push(asset);
  }
});

// Save to file
if (unused.length > 0) {
  fs.writeFileSync("unused-assets.txt", unused.join("\n"));
  console.log(`\n✅ Saved ${unused.length} unused assets to unused-assets.txt`);
} else {
  console.log("\n🎉 No unused assets found!");
}
