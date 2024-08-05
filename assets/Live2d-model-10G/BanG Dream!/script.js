import { globby } from "globby";
import path from "path";
import fs from "fs";

globby([
  "**/*.moc",
  //   "**/.model.json",
]).then(async (resList) => {
  console.log(resList.length);
  let a = 0;
  for (const mocItem of resList) {
    // console.log(mocItem);
    // console.log(path.dirname(mocItem) + "/" + path.basename(mocItem));
    // console.log(path.basename(mocItem));

    const dirname = path.dirname(mocItem);
    // console.log(mocItem); // asneeded/live2d/chara/001/001_2018_dog/kasumi_2018dog_t04.moc
    // console.log(dirname); // asneeded/live2d/chara/001/001_2018_dog

    let pngList = await globby([
      `${dirname}/**/*.png`,
      //   "**/*.png",
    ]);
    // if (pngList.length === 0) {
    //   console.log(mocItem);
    // }
    if (pngList.length > 0) {
      a += 1;
      const textures = pngList.map((item) => item.replace(dirname + "/", ""));
      const obj = {
        model: path.basename(mocItem),
        textures,
      };
      fs.writeFile(
        `${dirname}/model.json`,
        JSON.stringify(obj, null, 2),
        (err) => {
          if (err) throw err;
        }
      );
    }
  }
  console.log(a);
});

// const mocItem = `asneeded/live2d/chara/027/027_live_event_111_ssr/Gt_event111.moc`;

// const dirname = path.dirname(mocItem); // startapp/live2d/chara/027/027_school_winter
// const basename = path.basename(mocItem); // Gt_school_winter_v3.moc

// console.log(dirname);
// console.log(basename);

// 1.查找出所有 .moc[]

// 2. 遍历.moc[]

// 2.1 查找所有png，（检查这些png是不是都是同一个目录，如果有多个）

// globby([
//   `${dirname}/**/*.png`,
//   //   "**/*.png",
// ]).then((resList) => {
//   console.log(resList);
//   resList = resList.map((item) => item.split("/").at(-2));
//   console.log(resList);
// });
