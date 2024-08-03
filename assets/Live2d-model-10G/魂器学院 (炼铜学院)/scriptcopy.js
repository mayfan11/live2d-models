import { globby } from "globby";
import path from "path";
import { promises as fs } from "fs";

console.log(1);

globby(["live2d/**/model.json"]).then(async (resList) => {
  console.log(resList);
  console.log(resList.length);
  // for (const item of resList) {
  //   console.log(item);
  // }
  // for (const item of resList) {
  //   fs.rename(
  //     item,
  //     item.replace("new.Lead_00.model.json", "model.json"),
  //     (err) => {
  //       if (err) {
  //         console.error("重命名文件时出错:", err);
  //       } else {
  //         console.log("success");
  //       }
  //     }
  //   );
  // }
});
