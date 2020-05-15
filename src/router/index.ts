import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import List from "@/views/List.vue";
import Post from "@/views/Post.vue";
import About from "@/views/About.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/post/:postSlug",
    name: "Post",
    component: Post,
    props: true,
  },
  {
    path: "/:date?",
    name: "List",
    component: List,
    props: true,
  },
];

const router = new VueRouter({
  routes
});

export default router;
