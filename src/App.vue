<template>
  <div>
    <img
      src="/Snipaste_2024-07-29_10-39-40.png"
      alt=""
      style="position: fixed; top: 0; left: 0; z-index: -1"
    />
    <el-space style="margin-bottom: 20px">
      <el-select
        clearable
        v-model="current"
        style="width: 240px"
        @change="onChange"
        filterable
      >
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" @click="clipboard">clipboard</el-button>
      <el-button type="primary" @click="doExpression">doExpression</el-button>
      <el-button type="primary" @click="doMotion">doMotion</el-button>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { sample } from "lodash-es";
import models from "../model-nav/models.json";
import { useStorage } from "@vueuse/core";
import { onMounted } from "vue";
import { ElMessage } from "element-plus";
import path from "path-browserify";

const options = models.map((item, index) => {
  return {
    label: `【${index + 1}】${item}`,
    value: item,
  };
});
// console.log(options);

const current = useStorage("current", "");

// @ts-ignore
const PIXI = window.PIXI;
let model;

const clipboard = () => {
  navigator.clipboard.writeText(current.value).then(() => {
    ElMessage.success("复制成功");
  });
};

onMounted(() => {
  if (current.value) {
    init();
  }
});

const onChange = (e) => {
  location.reload();
};

const init = async () => {
  PIXI.live2d.SoundManager.volume = 1;

  model = await PIXI.live2d.Live2DModel.from(`/${current.value}`);

  const modelOriginalWidth = model.width;
  const modelOriginalHeight = model.height;
  model.height = 50;
  model.width = (modelOriginalWidth / modelOriginalHeight) * model.height;

  let appWidth = model.width;
  let appHight = model.height;

  model.x = 50;
  model.y = 50;
  appWidth += 100;
  appHight += 100;

  const app = new PIXI.Application({
    width: appWidth,
    height: appHight,
    transparent: true,
  });

  document.body.appendChild(app.view);
  app.view.style.position = "fixed";
  app.view.style.zIndex = "10";
  app.view.style.opacity = "0.5";

  app.stage.addChild(model);

  draggable(model);
  addFrame(model);
  addHitAreaFrames(model);

  model.on("hit", (hitAreas: string[]) => {
    hitAreas = hitAreas.map((item) => item.toLowerCase());
    if (hitAreas.includes("head")) {
      // 无参：随机表情
      doExpression();
    } else {
      doMotion();
    }
  });

  function addFrame(model: any) {
    const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
    foreground.width = model.internalModel.width;
    foreground.height = model.internalModel.height;
    foreground.alpha = 0.2;
    model.addChild(foreground);
  }

  function addHitAreaFrames(model: any) {
    const hitAreaFrames = new PIXI.live2d.HitAreaFrames();
    model.addChild(hitAreaFrames);
  }

  function draggable(model: any) {
    model.buttonMode = true;
    model.on("pointerdown", (e: any) => {
      model.dragging = true;
      model._pointerX = e.data.global.x - model.x;
      model._pointerY = e.data.global.y - model.y;
    });
    model.on("pointermove", (e: any) => {
      if (model.dragging) {
        model.position.x = e.data.global.x - model._pointerX;
        model.position.y = e.data.global.y - model._pointerY;
      }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
  }
};

const doExpression = () => {
  model.expression();
};
const doMotion = () => {
  const motionKeys = Object.keys(model.internalModel.settings.motions || {});
  const motion = sample(motionKeys);
  console.log(motion);
  model.motion(motion, undefined, PIXI.live2d.MotionPriority.FORCE);
};

const getRepeat = () => {
  let obj = {};
  models.forEach((item) => {
    const basename = path.basename(item);
    if (obj[basename]) {
      obj[basename].list.push(item);
    } else {
      obj[basename] = {
        list: [item],
      };
    }
  });
  for (const key in obj) {
    if (obj[key].list.length === 1) {
      delete obj[key];
    }
  }
  console.log(obj);
};
getRepeat();
</script>

<style scoped lang="scss"></style>
