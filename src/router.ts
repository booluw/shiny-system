import { createRouter, createWebHistory } from "vue-router"
// import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

import HomePage from "./views/HomePage.vue"
import { useSiteStore } from './store/site';

// function guard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
//   if (localStorage.getItem(token)) return next();
//   return next("/login");
// }

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
    }
  ],
  beforeRouteEnter() {
    const store = useSiteStore()
    store.loading = true;
  }
})
