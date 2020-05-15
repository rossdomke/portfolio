<template>
  <div>
    mountain nav {{ count }} <button @click="count += 1">+</button
    ><button @click="count = count - 1">-</button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class List extends Vue {
  private privCtr = 0;

  get count(): number {
    return this.privCtr;
  }
  set count(val) {
    this.privCtr = val;
  }
}
</script>
