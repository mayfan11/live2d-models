import glob from "glob-promise";
import fs from "fs";
import packageJson from "../package.json" assert { type: "json" };

glob("assets/**/*{model,model3,index}.json").then(function (contents) {
  console.log(contents.length);
  // const list = contents.map((item) => {
  //   return `${item}`;
  // });
  const npmList = contents.map((item) => {
    return `${packageJson.name}@${packageJson.version}/${item}`;
  });
  fs.writeFile("dist/models.json", JSON.stringify(contents, null, 2), (err) => {
    if (err) throw err;
    console.log("JSON data is written to data.json file.");
  });
  fs.writeFile(
    "dist/npm-models.json",
    JSON.stringify(npmList, null, 2),
    (err) => {
      if (err) throw err;
      console.log("JSON data is written to data.json file.");
    }
  );
});
