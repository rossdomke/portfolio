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
interface Sun {
  position: Point;
  color: string;
  radius: number;
}
interface Cloud {
  position: Point;
  color: string;
  opacity: number;
  speed: number;
  width: number;
  height: number;
}
interface CanvasData {
  width: number;
  height: number;
  colors: CanvasColors;
  mountains: Array<MountainRange>;
  clouds: Array<Cloud>;
  sun: Sun;
  cloudLimit: number;
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
  animationFrame = 0;
  canvasData: CanvasData = {
    width: 400,
    height: 300,
    colors: { mountain: "#F00", cloud: "#0F0", sun: "#00F" },
    mountains: [],
    clouds: [],
    sun: { position: { x: 0, y: 0 }, color: "#000:", radius: 150 },
    maxLines: 5,
    cloudLimit: 14,
    minRangeShift: 30,
    maxRangeShift: 40,
    minPeakShiftY: 10,
    maxPeakShiftY: 20,
    minPeakShiftX: 10,
    maxPeakShiftX: 70,
    startRangeAt: 150
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
  generateSun() {
    this.canvasData.sun = {
      position: {
        x: this.canvasData.width / 2,
        y: this.canvasData.startRangeAt + 30
      },
      radius: this.canvasData.startRangeAt,
      color: this.canvasData.colors.sun
    };
  }
  generateClouds() {
    this.canvasData.clouds = [];
    for (let i = 0; i < this.canvasData.cloudLimit; i += 1) {
      const cloud: Cloud = {
        position: {
          x: randBetween(0, this.canvasData.width),
          y: randBetween(35, this.canvasData.startRangeAt)
        },
        color: this.canvasData.colors.cloud,
        opacity: 0.5,
        width: randBetween(50, 100),
        height: randBetween(10, 15),
        speed: randBetween(3, 7)
      };
      this.canvasData.clouds.push(cloud);
    }
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
    if (!this.$refs.canvas) {
      window.requestAnimationFrame(this.draw);
      return;
    }
    this.$refs.canvas.width = this.canvasData.width;
    this.$refs.canvas.height = this.canvasData.height;

    const ctx = this.$refs.canvas.getContext("2d");
    if (ctx === null) {
      console.error("Null Context");
      return;
    }
    const { width, height, sun, mountains, clouds } = this.canvasData;
    ctx.clearRect(0, 0, width, height);

    // Draw sun
    ctx.beginPath();
    ctx.arc(sun.position.x, sun.position.y, sun.radius, 0, 2 * Math.PI);
    const circleGrd = ctx.createLinearGradient(
      width / 2,
      sun.position.y - sun.radius,
      width / 2 + 40,
      sun.position.y + sun.radius
    );
    circleGrd.addColorStop(0, "white");
    circleGrd.addColorStop(0.2, sun.color);
    circleGrd.addColorStop(1, sun.color);
    ctx.fillStyle = circleGrd;
    ctx.fill();
    // erase part of sunn that will be hidden by mountains
    ctx.clearRect(0, this.canvasData.startRangeAt + 100, width, height);
    // Draw Mountains
    mountains.forEach(mountain => {
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
      const clr = new Color(mountain.color).lighten(0.1);
      grd.addColorStop(0, mountain.color);
      grd.addColorStop(0.8, clr.hex());
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.fill();
    });
    // Draw Clouds
    clouds.forEach(cloud => {
      const pos: Point = {
        x: cloud.position.x - cloud.width / 2,
        y: cloud.position.y - cloud.height / 2
      };
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      // Top of cloud
      pos.x = pos.x + cloud.width;
      ctx.lineTo(pos.x, pos.y);

      //right circle
      ctx.arc(
        pos.x,
        pos.y - cloud.height / 2,
        cloud.height / 2,
        1.5 * Math.PI,
        0.5 * Math.PI
      );
      //right line of cloud
      pos.y = pos.y - cloud.height;
      ctx.lineTo(pos.x, pos.y);

      //bottom of cloud
      pos.x = pos.x - cloud.width;
      ctx.lineTo(pos.x, pos.y);

      //left half circle
      ctx.arc(
        pos.x,
        pos.y + cloud.height / 2,
        cloud.height / 2,
        0.5 * Math.PI,
        1.5 * Math.PI
      );
      ctx.closePath();
      ctx.globalAlpha = cloud.opacity;
      ctx.fillStyle = cloud.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    this.animationFrame += 1;
    this.animateCanvasData();
    window.requestAnimationFrame(this.draw);
  }
  animateClouds() {
    this.canvasData.clouds.forEach(cloud => {
      if (this.animationFrame % cloud.speed !== 0) return;
      cloud.position.x += 1;
      if (
        cloud.position.x - cloud.width / 2 - cloud.height / 2 >
        this.canvasData.width
      ) {
        cloud.position.x = -1 * (cloud.width / 2 + cloud.height / 2);
      }
    });
  }
  animateCanvasData() {
    this.animateClouds();
  }
  generateCanvasData() {
    this.generateSun();
    this.generateMountains();
    this.generateClouds();
  }

  @Watch("canvasData.width", { deep: true })
  cavasDataWatcher() {
    this.generateCanvasData();
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
    height: 300px;
    // border: solid red 1px;
  }
}
</style>
