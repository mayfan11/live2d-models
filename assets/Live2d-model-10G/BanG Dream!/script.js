import { globby } from "globby";
import path from "path";
import fs from "fs";

globby(["**/*.moc"]).then(async (resList) => {
  console.log(resList.length);
  for (const mocItem of resList) {
    const dirname = path.dirname(mocItem);
    // console.log(dirname);
    // console.log(`${dirname}/model.json`);
    const a = await globby([`${dirname}/model.json`]);
    if (!a.length) {
      console.log(mocItem);
    }
  }
});
