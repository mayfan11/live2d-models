import fs from "fs";
import packageJson from "../package.json" assert { type: "json" };
import { globby } from "globby";

globby([
  "assets/**/model.json",
  "assets/**/model3.json",
  "assets/**/*.model.json",
  "assets/**/*.model3.json",
  "assets/**/.model.json",
  "assets/**/.model3.json",
]).then((res) => {
  console.log(res.length);
  // const npmList = res.map((item) => {
  //   return `${packageJson.name}@${packageJson.version}/${item}`;
  // });
  // const githubList = res.map((item) => {
  //   return `${packageJson.author}/${packageJson.name}/${item}`;
  // });
  fs.writeFile("model-nav/models.json", JSON.stringify(res, null, 2), (err) => {
    if (err) throw err;
    console.log("JSON data is written to data.json file.");
  });
  // fs.writeFile(
  //   "menus/npm-models.json",
  //   JSON.stringify(npmList, null, 2),
  //   (err) => {
  //     if (err) throw err;
  //     console.log("JSON data is written to data.json file.");
  //   }
  // );
  // fs.writeFile(
  //   "menus/github-models.json",
  //   JSON.stringify(githubList, null, 2),
  //   (err) => {
  //     if (err) throw err;
  //     console.log("JSON data is written to data.json file.");
  //   }
  // );
});
