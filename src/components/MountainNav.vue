<template>
  <div id="mountain-nav" ref="nav">
    <div id="mountain-color" ref="mountainColor" class="color"></div>
    <div id="sun-color" ref="sunColor" class="color"></div>
    <div id="cloud-color" ref="cloudColor" class="color"></div>
    <canvas ref="canvas"></canvas>
    <button @click="generateMountains()">Generate</button>
    <input
      type="number"
      v-model="canvasData.maxLines"
      @keydown.enter="generateMountains()"
    />
    {{ canvasData }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Color from "color";

const randBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);
interface CanvasColors {
  mountain: string;
  cloud: string;
  sun: string;
}
interface Point {
  x: number;
  y: number;
}
interface MountainRange {
  midLinePosition: number;
  points: Array<Point>;
  color: string;
}

interface CanvasData {
  width: number;
  height: number;
  colors: CanvasColors;
  mountains: Array<MountainRange>;
  maxLines: number;
  minRangeShift: number;
  maxRangeShift: number;
  minPeakShiftY: number;
  maxPeakShiftY: number;
  minPeakShiftX: number;
  maxPeakShiftX: number;
  startRangeAt: number;
}

@Component
export default class List extends Vue {
  canvasData: CanvasData = {
    width: 400,
    height: 400,
    colors: { mountain: "#F00", cloud: "#0F0", sun: "#00F" },
    mountains: [],
    maxLines: 3,
    minRangeShift: 30,
    maxRangeShift: 40,
    minPeakShiftY: 10,
    maxPeakShiftY: 20,
    minPeakShiftX: 10,
    maxPeakShiftX: 70,
    startRangeAt: 100
  };

  $refs!: {
    canvas: HTMLCanvasElement;
    nav: HTMLDivElement;
    mountainColor: HTMLDivElement;
    sunColor: HTMLDivElement;
    cloudColor: HTMLDivElement;
  };

  mounted() {
    console.log(this.$refs.nav);
    window.addEventListener("resize", this.resize);
    this.$nextTick(() => {
      this.updateColors();
      this.resize();
    });
    window.requestAnimationFrame(this.draw);
  }

  resize() {
    console.log("resizeing");
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

  generateMountains(): void {
    console.log("Generating Mountains");
    this.canvasData.mountains = [];
    const color = Color(this.canvasData.colors.mountain);
    for (let rangeNum = 0; rangeNum < this.canvasData.maxLines; rangeNum += 1) {
      const range: MountainRange = {
        midLinePosition:
          this.canvasData.startRangeAt +
          randBetween(
            this.canvasData.minRangeShift,
            this.canvasData.maxRangeShift
          ) *
            rangeNum,
        points: [],
        color: color.darken(0.05 * rangeNum)
      };
      let point: Point = { x: 0, y: range.midLinePosition };
      range.points.push(point);
      while (point.x < this.canvasData.width) {
        point = {
          x:
            point.x +
            randBetween(
              this.canvasData.minPeakShiftX,
              this.canvasData.maxPeakShiftX
            ),
          y:
            point.y +
            randBetween(
              this.canvasData.minPeakShiftY,
              this.canvasData.maxPeakShiftY
            ) *
              (point.y > range.midLinePosition ? -1 : 1)
        };
        range.points.push(point);
      }
      this.canvasData.mountains.push(range);
    }
    console.log("Done Generating Mountains");
  }

  draw() {
    this.$refs.canvas.width = this.canvasData.width;
    this.$refs.canvas.height = this.canvasData.height;

    const ctx = this.$refs.canvas.getContext("2d");
    if (ctx === null) {
      console.error("Null Context");
      return;
    }
    const { width, height } = this.canvasData;

    // Draw Circle
    ctx.beginPath();
    const circleOffset = randBetween(-30, 30);
    ctx.arc(
      width / 2 + circleOffset,
      this.canvasData.startRangeAt,
      height / 6 + randBetween(0, 15),
      0,
      2 * Math.PI
    );
    const circleGrd = ctx.createLinearGradient(
      width / 2,
      this.canvasData.startRangeAt - height / 5,
      width / 2,
      this.canvasData.startRangeAt + height / 8
    );
    circleGrd.addColorStop(0, "white");
    circleGrd.addColorStop(0.4, this.canvasData.colors.sun);
    circleGrd.addColorStop(1, this.canvasData.colors.sun);
    ctx.fillStyle = circleGrd;
    ctx.fill();
    // Draw Mountains
    this.canvasData.mountains.forEach(mountain => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      mountain.points.forEach(pt => {
        ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineTo(width, height);
      ctx.closePath();
      const grd = ctx.createLinearGradient(
        width / 2,
        mountain.midLinePosition,
        width / 2,
        height
      );
      // grd.addColorStop(0, mountain.color);
      const clr = new Color(mountain.color).lighten(0.1);

      grd.addColorStop(0, mountain.color);
      grd.addColorStop(0.3, clr.hex());
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fill();
      // ctx.stroke();
    });
    window.requestAnimationFrame(this.draw);
  }

  @Watch("canvasData.width", { deep: true })
  cavasDataWatcher() {
    this.generateMountains();
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
