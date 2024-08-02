import { globby } from "globby";
import path from "path";
import { promises as fs } from "fs";

globby(["live2d/**/*.model.json", "live2d/**/*.model3.json"]).then(
  async (resList) => {
    console.log(resList);
    resList = resList.filter((item) => item.indexOf("new.") === -1);
    console.log(resList);
    // const string = await fs.readFile(res[0], "utf8");
    // const obj = eval("(" + string + ")");
    // const filename = path.filename(res);
    // console.log(obj.textures);

    for (const item of resList) {
      const basename = path.basename(item);
      try {
        const string = await fs.readFile(item, "utf8");
        const obj = eval("(" + string + ")");
        //  textures: { '11190': [ 'texture_00.png' ] } = >  textures: [ 'texture_00.png' ]
        if (!Array.isArray(obj.textures)) {
          obj.textures = obj.textures[Object.keys(obj.textures)[0]];
        }
        obj.textures = obj.textures.map((texturesItem) => {
          return texturesItem.includes("textures/")
            ? texturesItem
            : "textures/" + texturesItem;
        });
        // console.log(obj.textures);

        //  texture_00.png => textures/texture_00.png
        const writeFileName = `${path.dirname(item)}/new.${path.basename(
          item
        )}`;
        await fs.writeFile(writeFileName, JSON.stringify(obj, null, 2));
      } catch (error) {
        console.log(item);
        console.log(error);
      }
    }
    // await fs.writeFile("./log", writeContent);
  }
);
