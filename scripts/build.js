const glob = require("glob-promise");
const path = require("path");
const fs = require("fs");
const package = require("../package.json");

console.log(package.version);

glob("models/**/*{model,model3}.json").then(function (contents) {
  console.log(contents);
  // "https://jsd.onmicrosoft.cn/npm/alligator-sinensis-live2d-model@1.0.1/models/haru/haru_greeter_t03.model3.json"
  // fs.writeFile("data.json", JSON.stringify(contents, null, 2), (err) => {
  //   if (err) throw err;
  //   console.log("JSON data is written to data.json file.");
  // });
});
