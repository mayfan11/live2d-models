import fs from "fs";
import path from "path";
import { globby } from "globby";

globby(["**/*.moc"]).then(async (mocList) => {
  for (const mocItem of mocList) {
    const mocItemDirname = path.dirname(mocItem);
    const mocItemBasename = path.basename(mocItem);
    const expressionList = await globby([`${mocItemDirname}/expression/**/*`]);
    const expression = expressionList.map((expressionItem) => {
      return {
        file: expressionItem.replace(mocItemDirname + "/", ""),
        name: path.basename(expressionItem),
      };
    });
    const pngList = await globby([`${mocItemDirname}/**/*.png`]);
    const textures = pngList.map((item) =>
      item.replace(mocItemDirname + "/", "")
    );
    const actionList = await globby([`${mocItemDirname}/action/**/*.mtn`]);
    const motionsIdle = actionList.map((actionItem) => {
      return {
        file: actionItem.replace(mocItemDirname + "/", ""),
      };
    });
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

    fs.writeFile(
      `${mocItemDirname}/model.json`,
      JSON.stringify(model, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
  }
});
