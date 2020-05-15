<template>
  <div>
    Post Hero Box
    {{ post }}
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from 'vue-property-decorator';
import { Post, Photo } from "@/types";

@Component
export default class PostHeroBox extends Vue {
  @Prop() post!: Post;
}
</script>
