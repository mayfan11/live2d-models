<template>
  <div>
    <img
      src="/Snipaste_2024-07-29_10-39-40.png"
      alt=""
      style="position: fixed; top: 0; left: 0; z-index: -1"
    />
    <el-space style="margin-bottom: 20px">
      <el-select-v2
        v-model="current"
        :options="options"
        style="width: 300px"
        :filterable="false"
        @change="onChange"
        clearable
        popper-class="popper-class-66666"
      >
        <template #header>
          <el-input v-model="search" clearable></el-input>
        </template>
        <template #default="{ item }">
          <span :title="item.label">{{ item.label }}</span>
        </template>
      </el-select-v2>
      <el-button type="primary" @click="clipboard">clipboard</el-button>
      <el-button type="primary" @click="doExpression">doExpression</el-button>
      <el-button type="primary" @click="doMotion">doMotion</el-button>
      <!-- <el-button type="primary" @click="clearModel">clearModel</el-button> -->
    </el-space>
    <div>
      <el-input-number
        @change="onChange"
        v-model="height"
        style="margin-bottom: 20px"
      ></el-input-number>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sample } from "lodash-es";
import models from "../model-nav/models.json";
import { useStorage } from "@vueuse/core";
import { onMounted, computed } from "vue";
import { ElMessage } from "element-plus";
import path from "path-browserify";
import useClipboard from "vue-clipboard3";

const options = computed(() => {
  const map = models.map((item, index) => {
    return {
      label: `【${index + 1}】${item}`,
      value: item,
    };
  });
  const filter = map.filter((item) =>
    item.label.toLowerCase().includes(search.value.toLowerCase())
  );
  return filter;
});
// console.log(options);

const height = useStorage("height", 150);
const current = useStorage("current", "");
const search = useStorage("search", "");

const { toClipboard } = useClipboard();

// @ts-ignore
const PIXI = window.PIXI;
let model;
let app;

onMounted(() => {
  init();
  addModel();
});

const onChange = () => {
  clearModel();
  addModel();
};

const clearModel = () => {
  if (!model) return;
  if (model.texture) {
    model.texture.destroy(true);
  }
  model.destroy(true);
  model = null;
};

const init = () => {
  app = new PIXI.Application({
    width: 0,
    height: 0,
    // transparent: true,
  });
  PIXI.live2d.SoundManager.volume = 1;
  document.body.appendChild(app.view);
  app.view.style.position = "fixed";
  app.view.style.left = "0";
  app.view.style.bottom = "0";
  app.view.style.zIndex = "10";
  // app.view.style.opacity = "0.5";
};

const addModel = async () => {
  if (!current.value) return;
  try {
    model = await PIXI.live2d.Live2DModel.from(`/${current.value}`);
    const modelOriginalWidth = model.width;
    const modelOriginalHeight = model.height;
    model.height = height.value;
    model.width = (modelOriginalWidth / modelOriginalHeight) * model.height;
    let appWidth = model.width;
    let appHight = model.height;
    model.x = 10;
    model.y = 10;
    appWidth += model.x * 2;
    appHight += model.y * 2;
    app.renderer.resize(appWidth, appHight);
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
  } catch (error) {
    ElMessage.error("加载失败");
    throw error;
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

const clipboard = async () => {
  // navigator.clipboard.writeText(current.value).then(() => {
  //   ElMessage.success("复制成功");
  // });
  try {
    await toClipboard(current.value);
    ElMessage.success("复制成功");
  } catch (e) {
    ElMessage.error("复制失败");
  }
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

<style lang="scss">
.popper-class-66666 {
  width: 800px;
  display: block !important;
  .el-select-dropdown {
    width: 100% !important;
    .el-select-dropdown__list {
      width: 100% !important;
    }
  }
}
</style>
