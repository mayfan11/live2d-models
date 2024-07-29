import glob from "glob-promise";
import fs from "fs";
import path from "path";
import getFolderSize from "get-folder-size";
import bytes from "bytes";

(async function test() {
  const a = await glob("assets/vscode-live2d-models/*");
  const b = await glob("assets/moc/*");
  // const size = await getFolderSize.loose("assets/vscode-live2d-models");

  let aList = [];
  for (const item of a) {
    let res = { path: item };
    res.name = path.basename(item);
    res.size = await getFolderSize.loose(item);
    aList.push(res);
  }
  let bList = [];
  for (const item of b) {
    let res = { path: item };
    res.name = path.basename(item);
    res.size = await getFolderSize.loose(item);
    bList.push(res);
  }
  console.log(aList.length, aList);
  console.log(bList.length, bList);

  const filter = aList.filter((aItem) => {
    return bList.find((bItem) => bItem.name === aItem.name);
  });
  console.log(filter.length, filter);
})();
