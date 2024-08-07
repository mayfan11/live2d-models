import fs from "fs";
import path from "path";
import { globby } from "globby";

// globby([`**/moc/**/*`]).then((res) => {
//   console.log(res.length);
// });

globby(["**/*.moc"]).then(async (mocList) => {
  console.log(mocList.length);
  for (const mocItem of mocList) {
    // console.log(mocItem);
    const mocItemDirname = path.dirname(mocItem);
    const mocItemBasename = path.basename(mocItem);
    // console.log({ mocItemDirname, mocItemBasename });
    const expressionList = await globby([`${mocItemDirname}/expression/**/*`]);
    // console.log(expressionList);
    const expression = expressionList.map((expressionItem) => {
      return {
        file: expressionItem.replace(mocItemDirname + "/", ""),
        name: path.basename(expressionItem),
      };
    });
    // console.log(expression);
    const pngList = await globby([`${mocItemDirname}/**/*.png`]);
    const textures = pngList.map((item) =>
      item.replace(mocItemDirname + "/", "")
    );
    console.log(mocItemDirname);
    // console.log(pngList);
    console.log(textures);

    const actionList = await globby([`${mocItemDirname}/action/**/*.mtn`]);
    const motionsIdle = actionList.map((actionItem) => {
      return {
        file: actionItem.replace(mocItemDirname + "/", ""),
      };
    });
    console.log(motionsIdle);

    const model = {
      expression: expression,
      model: mocItemBasename,
      motions: {
        idle: motionsIdle,
      },
      textures: textures,
      physics: "moc/physics.json",
      version: "Sample 1.0.0",
    };
  }
  fs.writeFile(
    `${mocItemDirname}/model.json`,
    JSON.stringify(model, null, 2),
    (err) => {
      if (err) throw err;
    }
  );
});
