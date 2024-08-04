import { globby } from "globby";
import path from "path";

// globby([
//   "**/*.moc",
//   //   "**/.model.json",
// ]).then((resList) => {
//   console.log(resList.length);
//   for (const mocItem of resList) {
//     console.log(mocItem);
//     // console.log(path.dirname(mocItem) + "/" + path.basename(mocItem));
//     console.log(path.basename(mocItem));
//     const obj = {
//       model: path.basename(mocItem),
//       textures: ["kasumi_2018dog_t04.1024/texture_00.png"],
//     };
//   }
// });

const mocItem = `asneeded/live2d/chara/027/027_live_event_111_ssr/Gt_event111.moc`;

const dirname = path.dirname(mocItem); // startapp/live2d/chara/027/027_school_winter
const basename = path.basename(mocItem); // Gt_school_winter_v3.moc

console.log(dirname);
console.log(basename);

globby([
  `${dirname}/**/*.png`,
  //   "**/*.png",
]).then((resList) => {
  console.log(resList);
  resList = resList.map((item) => item.split("/"));
  console.log(resList);
});
