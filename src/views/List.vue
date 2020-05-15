<template>
  <div id="post-list">
    <div v-for="post in posts" :key="post.slug">
      <post-hero-box :post="post" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import PostHeroBox from "@/components/PostHeroBox.vue";
import { Post } from "@/types";
import { Posts } from "@/dummyData";

@Component({
  components: { PostHeroBox }
})
export default class List extends Vue {
  posts: Array<Post> = Posts;
}
</script>
