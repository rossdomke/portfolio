<template>
  <div>
    <h2>{{ post.title }}</h2>
    <p>{{ ShortBody }}</p>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Post, Photo } from "@/types";

@Component
export default class PostHeroBox extends Vue {
  @Prop() post!: Post;
  get ShortBody(): string {
    return this.post.body.substring(0, 150) + "...";
  }
}
</script>
