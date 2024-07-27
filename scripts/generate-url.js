const glob = require("glob-promise");
const path = require("path");

glob("models/**/*{model,model3}.json").then(function (contents) {
  console.log(contents);
});
