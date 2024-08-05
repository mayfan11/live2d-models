import { globby } from "globby";
import path from "path";
import fs from "fs";

globby(["**/*.moc *"]).then(async (resList) => {
  console.log(resList.length);
  // console.log(resList);

  for (const mocItem of resList) {
    const dirname = path.dirname(mocItem);
    //   // console.log(dirname);
    //   // console.log(`${dirname}/model.json`);
    const finds = await globby([`${dirname}/model.json`]);
    if (!finds.length) {
      console.log(mocItem);
    }
  }
});
