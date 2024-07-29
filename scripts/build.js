const glob = require("glob-promise");
const path = require("path");
const fs = require("fs");
const package = require("../package.json");

console.log(package.name);
console.log(package.version);

glob("models/**/*{model,model3}.json").then(function (contents) {
  const list = contents.map(item=>{
    return `${package.name}@${package.version}/${item}`
  })
  fs.writeFile("dist/index.json", JSON.stringify(list, null, 2), (err) => {
    if (err) throw err;
    console.log("JSON data is written to data.json file.");
  });
});
