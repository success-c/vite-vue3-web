<template>
  <div class="drag-verify-container" :class="visible ? 'show_drag' : null">
    <div :style="dragVerifyImgStyle" style="position: relative">
      <img
        ref="checkImg"
        crossOrigin="anonymous"
        :src="imgsrc"
        @load="checkimgLoaded"
        style="width: 100%"
        alt=""
      />
      <canvas ref="maincanvas" class="main-canvas"></canvas>
      <canvas
        ref="movecanvas"
        :class="{ goFirst: isOk, goKeep: isKeep }"
        class="move-canvas"
      ></canvas>
      <div v-if="loading" class="loading">
        <!-- <van-icon name="replay" class="animate" @click="refreshimg" /> -->
        <icon-refresh style="color: #000" class="animate" @click="refreshimg" />

        <span>加载中<span class="dot">...</span></span>
      </div>
      <div class="refresh" v-if="showRefresh && !isPassing">
        <!-- <i :class="refreshIcon" @click="refreshimg"></i> -->
        <icon-refresh style="color: #ccc" @click="refreshimg" />
        <!-- <van-icon name="replay"  /> -->
      </div>
      <div class="tips success" v-if="showTips && isPassing">
        {{ successTip }}
      </div>
      <div class="tips danger" v-if="showTips && !isPassing && showErrorTip">
        {{ failTip }}
      </div>
    </div>
    <div
      ref="dragVerify"
      class="drag_verify"
      :style="dragVerifyStyle"
      @mousemove="dragMoving"
      @mouseup="dragFinish"
      @mouseleave="dragFinish"
      @touchmove="dragMoving"
      @touchend="dragFinish"
    >
      <div
        class="dv_progress_bar"
        :class="{ goFirst2: isOk }"
        ref="progressBar"
        :style="progressBarStyle"
      >
        {{ successMessage }}
      </div>
      <div class="dv_text" :style="textStyle" ref="message">
        {{ message1 }}
      </div>

      <div
        class="dv_handler dv_handler_bg"
        :class="{ goFirst: isOk }"
        @mousedown="dragStart"
        @touchstart="dragStart"
        ref="handler"
        :style="handlerStyle"
      >
        <!-- <i :class="handlerIcon"></i> -->
        <icon-double-right v-if="!props.isPassing" style="font-size: 20px" />
        <!-- <img  :src="isshowIcon" style="user-select: none;-webkit-user-select: none;pointer-events: none;" width="20px"></img> -->
        <icon-check-circle v-else style=" font-size: 20px;color: #76c61d" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

interface Props {
  isPassing?: boolean;
  width?: number;
  visible?: boolean;
  height?: number;
  text?: string;
  barImg?: any;
  successText?: string;
  background?: string;
  progressBarBg?: string;
  completedBg?: string;
  circle?: boolean;
  radius?: string;
  handlerIcon?: string;
  successIcon?: string;
  handlerBg?: string;
  textSize?: string;
  textColor?: string;
  imgsrc?: string;
  barWidth?: number;

  barRadius?: number;
  showRefresh?: boolean;
  refreshIcon?: string;
  showTips?: boolean;

  successTip?: string;
  failTip?: string;

  diffWidth?: number;
}

const loading = ref(false);
const props = withDefaults(defineProps<Props>(), {
  diffWidth: 20,
  failTip: "验证未通过，拖动滑块将悬浮图像正确合并",
  successTip: "验证通过，超过80%用户",
  showTips: true,
  showRefresh: false,
  barRadius: 8,
  barWidth: 40,
  textColor: "#333",
  textSize: "14px",
  handlerBg: "#fff",
  text: "swiping to the right side",
  radius: "4px",
  completedBg: "#76c61d",
  progressBarBg: "#76c61d",
  background: "#eee",
  successText: "success",
  width: 320,
  height: 40
});

const dragVerify = ref();
const checkImg = ref();
const movecanvas = ref();
const progressBar = ref();
const handler = ref();
const maincanvas = ref();
const message = ref();

const emits = defineEmits<{
  (e: "refresh", data: any): any;
  (e: "passcallback", data: any): any;
  (e: "handlerMove", data: any): any;
  (e: "passfail", data: any): any;
  (e: "update:isPassing", data: any): any;
}>();
onMounted(() => {
  const dragEl = dragVerify as any;
  dragEl.value?.style.setProperty("--textColor", props.textColor);
  dragEl.value?.style.setProperty(
    "--width",
    Math.floor(Number(props.width) / 2) + "px"
  );
  dragEl.value?.style.setProperty(
    "--pwidth",
    -Math.floor(Number(props.width) / 2) + "px"
  );
});
const curPos = ref(0);
const handlerStyle = computed(() => {
  return {
    left: curPos.value,
    width: props.height + "px",
    height: props.height + "px",
    background: props.handlerBg
  };
});
const message1 = computed(() => {
  return props.isPassing ? "" : (props.text as any);
});
// const isshowIcon = computed(() => {
//   return props.isPassing ? props.successIcon : (props.barImg as any);
// });
const successMessage = computed(() => {
  return props.isPassing ? props.successText : "";
});
const dragVerifyStyle = computed(() => {
  return {
    width: props.width + "px",
    height: props.height + "px",
    lineHeight: props.height + "px",
    background: props.background,
    borderRadius: props.circle ? Number(props.height) / 2 + "px" : props.radius
  };
});
const dragVerifyImgStyle = computed(() => {
  return {
    width: props.width + "px",
    // position: "relative",
    overflow: "hidden"
  };
});
const progressBarStyle = computed(() => {
  return {
    background: props.progressBarBg,
    height: props.height + "px",
    borderRadius: props.circle
      ? Number(props.height) / 2 + "px 0 0 " + Number(props.height) / 2 + "px"
      : props.radius
  };
});
const textStyle = computed(() => {
  return {
    height: props.height + "px",
    width: props.width + "px",
    fontSize: props.textSize
  };
});
const isMoving = ref(false);
const x = ref(0);
const isOk = ref(false);
const isKeep = ref(false);
const clipBarx = ref(0);
const showErrorTip = ref(false);

const draw = (ctx: any, x: any, y: any, operation: any) => {
  const l = Number(props.barWidth);
  const r = Number(props.barRadius);
  const PI = Math.PI;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(200, 255, 255, 0.8)";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = "destination-over";
};
const checkimgLoaded = () => {
  // 生成图片缺失位置
  var barWidth = props.barWidth;
  var imgHeight = checkImg.value.height;
  var imgWidth = checkImg.value.width;
  var halfWidth = Math.floor(props.width / 2);
  var refreshHeigth = 25;
  var tipHeight = 20;
  var x =
    halfWidth +
    Math.ceil(Math.random() * (halfWidth - barWidth - props.barRadius - 5));
  var y =
    refreshHeigth +
    Math.floor(
      Math.random() * (imgHeight - barWidth - refreshHeigth - tipHeight)
    );
  if (!maincanvas) return;

  maincanvas.value.setAttribute("width", imgWidth);
  maincanvas.value.setAttribute("height", imgHeight);
  maincanvas.value.style.display = "block";
  var canvasCtx = maincanvas.value.getContext("2d", {
    willReadFrequently: true
  });
  draw(canvasCtx, x, y, "fill");
  clipBarx.value = x;

  var moveCanvas = movecanvas;
  moveCanvas.value.setAttribute("width", imgWidth);
  moveCanvas.value.setAttribute("height", imgHeight);
  movecanvas.value.style.display = "block";
  const L = barWidth + props.barRadius * 2 + 3; //实际宽度
  var moveCtx = movecanvas.value.getContext("2d", {
    willReadFrequently: true
  });
  moveCtx.clearRect(0, 0, imgWidth, imgHeight);
  draw(moveCtx, x, y, "clip");
  moveCtx.drawImage(checkImg.value, 0, 0, imgWidth, imgHeight);
  var y = y - props.barRadius * 2 - 1;
  const ImageData = moveCtx.getImageData(x, y, L, L);
  moveCanvas.value.setAttribute("width", L);
  moveCanvas.value.setAttribute("height", imgHeight);
  moveCtx.putImageData(ImageData, 0, y);
};

const dragStart = (e: any) => {
  if (!props.isPassing) {
    isMoving.value = true;
    x.value =
      (e.pageX || e.touches[0].pageX) -
      parseInt(handler.value.style.left.replace("px", ""), 10);
  }
  // showBar = true;
  showErrorTip.value = false;
  emits("handlerMove", {});
};
const dragMoving = (e: any) => {
  if (isMoving.value && !props.isPassing) {
    var _x = (e.pageX || e.touches[0].pageX) - x.value;
    handler.value.style.left = _x + "px";
    progressBar.value.style.width = _x + props.height / 2 + "px";
    movecanvas.value.style.left = _x + "px";
  }
};
const dragFinish = (e: any) => {
  if (isMoving && !props.isPassing) {
    var _x = (e.pageX || e.changedTouches[0].pageX) - x.value;
    if (Math.abs(_x - clipBarx.value) > props.diffWidth) {
      isOk.value = true;
      setTimeout(function () {
        handler.value.style.left = "0";
        progressBar.value.style.width = "0";
        movecanvas.value.style.left = "0";
        isOk.value = false;
      }, 500);
      emits("passfail", {});
      showErrorTip.value = true;
    } else {
      passVerify();
    }
    isMoving.value = false;
  }
};
const passVerify = () => {
  emits("update:isPassing", true);
  isMoving.value = false;
  // handler.value.children[0].className = props.successIcon;
  progressBar.value.style.background = props.completedBg;
  message.value.style["-webkit-text-fill-color"] = "unset";
  message.value.style.animation = "slidetounlock2 3s infinite";
  progressBar.value.style.color = "#fff";
  progressBar.value.style.fontSize = props.textSize;
  isKeep.value = true;
  console.log("///", clipBarx.value);
  curPos.value = clipBarx.value;
  setTimeout(() => {
    movecanvas.value.style.left = clipBarx.value + "px";
    setTimeout(() => {
      isKeep.value = false;
      // maincanvas.value.style.display = "none";
      // movecanvas.value.style.display = "none";
    }, 200);
  }, 100);
  reset();

  emits("passcallback", {});
};
const reset = () => {
  reImg();
  checkimgLoaded();
};
const reImg = () => {
  emits("update:isPassing", false);
  // const oriData = this.$options.data();
  // for (const key in oriData) {
  //   if (Object.prototype.hasOwnProperty.call(oriData, key)) {
  //     this.$set(this, key, oriData[key]);
  //   }
  // }

  handler.value.style.left = "0px";
  progressBar.value.style.width = "0";
  // handler.value.children[0].className = props.handlerIcon;
  message.value.style["-webkit-text-fill-color"] = "transparent";
  message.value.style.animation = "slidetounlock 3s infinite";
  message.value.style.color = props.background;
  movecanvas.value.style.left = "0px";
};
const sleep = (time: any) => {
  loading.value = true;
  handler.value.style.left = "0px";
  progressBar.value.style.width = "0";
  emits("update:isPassing", false);
  movecanvas.value.style.left = "0px";

  setTimeout(() => {
    reset();
    loading.value = false;
  }, time);
};
const refreshimg = () => {
  emits("refresh", {});
  sleep(1000);
};
watch(
  () => props.imgsrc,
  () => {
    reImg();
  },
  { immediate: false }
);
// watch: {
//   imgsrc: {
//     immediate: false,
//     handler: function () {
//       this.reImg();
//     },
//   },
// },
defineExpose({ refreshimg });
</script>
<style scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  background-color: rgb(255 255 255 / 80%);
}

.drag_verify {
  position: relative;
  overflow: hidden;
  text-align: center;
  background-color: #e8e8e8;
}

.drag_verify .dv_handler {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: move;
}

.drag_verify .dv_handler i {
  padding-left: 0;
  font-size: 16px;
  color: #666;
}

.drag_verify .dv_handler .el-icon-circle-check {
  margin-top: 9px;
  color: #6c6;
}

.drag_verify .dv_progress_bar {
  position: absolute;
  width: 0;
  height: 34px;
}

.dot {
  display: inline-block;
  overflow: hidden;
  height: 1em;
  text-align: left;
  line-height: 1;
  vertical-align: -0.25em;
}

.dot::before {
  display: block;
  white-space: pre-wrap; /* 也可以是white-space: pre */
  content: "...\A..\A.";
  animation: dot 1s infinite step-start both;
}

@keyframes dot {
  33% {
    transform: translateY(-2em);
  }

  66% {
    transform: translateY(-1em);
  }
}

.drag_verify .dv_text {
  position: absolute;
  top: 0;
  color: transparent;
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, var(--textColor)),
    color-stop(0.4, var(--textColor)),
    color-stop(0.5, #fff),
    color-stop(0.6, var(--textColor)),
    color-stop(1, var(--textColor))
  );
  background-clip: text;
  user-select: none;
  -webkit-text-fill-color: transparent;
  text-size-adjust: none;
  animation: slidetounlock 3s infinite;
}

.animate {
  animation: rotate 1s linear infinite;
  margin-right: 5px;
}

.drag_verify .dv_text * {
  -webkit-text-fill-color: var(--textColor);
}

.goFirst {
  left: 0 !important;
  transition: left 0.5s;
}

.goKeep {
  transition: left 0.2s;
}

.goFirst2 {
  width: 0 !important;
  transition: width 0.5s;
}

.drag-verify-container {
  position: absolute;
  left: 100%;
  overflow: hidden;
  border-radius: 10px;
  opacity: 0;
  box-shadow: 0 0 20px #ccc;
  line-height: 0;
}

.show_drag {
  left: 50%;
  opacity: 1;
  transition: all 0.5s;
  transform: translateX(-50%);
}

.refresh {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 200;
  font-size: 20px;
  cursor: pointer;
}

.tips {
  position: absolute;
  bottom: 0;
  z-index: 200;
  width: 100%;
  height: 20px;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}

.tips.success {
  color: green;
  background: rgb(255 255 255 / 60%);
}

.tips.danger {
  color: yellow;
  background: rgb(0 0 0 / 60%);
}

.main-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.move-canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
<style>
@keyframes slidetounlock {
  0% {
    background-position: var(--pwidth) 0;
  }

  100% {
    background-position: var(--width) 0;
  }
}

@keyframes slidetounlock2 {
  0% {
    background-position: var(--pwidth) 0;
  }

  100% {
    background-position: var(--pwidth) 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
