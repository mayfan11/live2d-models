import { globby } from "globby";

globby([
  "assets/**/model.json",
  "assets/**/model3.json",
  "assets/**/*.model.json",
  "assets/**/*.model3.json",
  "assets/**/.model.json",
  "assets/**/.model3.json",
]).then((resList) => {
  console.log(resList);
});
