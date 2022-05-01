import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

import HomePage from "./pages/HomePage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
    name: "home",
  },
];

export const router = new Router({
  mode: "history",
  routes,
});
