<template>
  <div id="app">
    <mountain-nav />
    <router-view />
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import MountainNav from "@/components/MountainNav.vue";

@Component({
  components: { MountainNav }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./scss/portfolio.scss";

</style>
