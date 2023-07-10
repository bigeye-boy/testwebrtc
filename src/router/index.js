import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from '~pages'
import { createWebHistory, createRouter } from "vue-router";
const routes = setupLayouts(generatedRoutes)
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return {
          el: to.hash,
        }
      }
    },
  });
export default router