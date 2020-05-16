<template>
  <div id="mountain-nav" ref="nav">
    <div id="mountain-color" ref="mountainColor" class="color"></div>
    <div id="sun-color" ref="sunColor" class="color"></div>
    <div id="cloud-color" ref="cloudColor" class="color"></div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import * as _ from "lodash";

interface CanvasColors {
  mountain: string;
  cloud: string;
  sun: string;
}

interface CanvasData {
  width: number;
  height: number;
  colors: CanvasColors;
}

@Component
export default class List extends Vue {
  canvasData: CanvasData = {
    width: 400,
    height: 400,
    colors: { mountain: "#F00", cloud: "#0F0", sun: "#00F" }
  };

  $refs!: {
    canvas: HTMLCanvasElement;
    nav: HTMLDivElement;
    mountainColor: HTMLDivElement;
    sunColor: HTMLDivElement;
    cloudColor: HTMLDivElement;
  };

  mounted() {
    this.$refs.nav.addEventListener("resize", this.resize);
    this.$nextTick(() => {
      this.resize();
    });
  }

  resize() {
    this.canvasData.width = this.$refs.nav.clientWidth;
  }

  updateColors() {
    if (!this.$refs.mountainColor) return;
    const elems = {
      mountain: this.$refs.mountainColor,
      sun: this.$refs.sunColor,
      cloud: this.$refs.cloudColor
    };
    Object.entries(elems).forEach(([key, div]) => {
      this.canvasData.colors[key as keyof CanvasColors] = getComputedStyle(
        div
      ).backgroundColor;
    });
  }

  draw() {
    this.updateColors();
    this.$refs.canvas.width = this.canvasData.width;
    this.$refs.canvas.height = this.canvasData.height;

    const ctx = this.$refs.canvas.getContext("2d");
    if (ctx === null) {
      console.error("Null Context");
      return;
    }
    const colors = this.canvasData.colors;
    const { width, height } = this.canvasData;
    ctx.fillStyle = colors.cloud;
    ctx.fillRect(0, 0, width, height / 3);
    ctx.fillStyle = colors.sun;
    ctx.fillRect(0, height / 3, width, height / 3);
    ctx.fillStyle = colors.mountain;
    ctx.fillRect(0, (height / 3) * 2, width, height / 3);
  }

  @Watch("canvasData.width", { deep: true })
  cavasDataWatcher() {
    this.draw();
  }
}
</script>

<style lang="scss">
@import "../scss/colors";
#mountain-nav {
  width: 100%;
  .color {
    display: none;
    width: 10px;
    height: 10px;
    margin: 10px;
    background-color: yellow;
    &#mountain-color {
      background-color: $mountain-color;
    }
    &#sun-color {
      background-color: $sun-color;
    }
    &#cloud-color {
      background-color: $cloud-color;
    }
  }
  > canvas {
    width: 100%;
    height: 400px;
    // border: solid red 1px;
  }
}
</style>
