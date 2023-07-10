import { createApp } from "vue";
// import { ViteSSG } from 'vite-ssg'
import router from './router'
import { createPinia } from 'pinia'
import { Tabs, Tab } from 'vue3-tabs-component';
//default styles

import './utils/rem'
import './style.css'
import './style/tabs-component.css'
import App from './App.vue'
import 'virtual:uno.css'
import '@unocss/reset/tailwind.css'

// export const createApp = ViteSSG(
//   App,
//   { routes, base: import.meta.env.BASE_URL },
//   ({ app, router, routes, isClient, initialState }) => {
//     const pinia = createPinia()
//     app.use(pinia)
//     app.component('tabs', Tabs);
//     app.component('tab', Tab);
//     app.component('DraggableResizable', Vue3DraggableResizable);
//     app.component('Vue3Lottie', Vue3Lottie);
//   },
// )

const app = createApp(App);
app.use(router);
app.use(createPinia())
app.component('tabs', Tabs);
app.component('tab', Tab);
app.directive('resize-text', {
  mounted(el) {
    el.style.transition = '0.2s';
  },
  updated(el, binding) {
    if (binding.value.value !== binding.oldValue.value) {
      el.style.transform = `scale(${binding.value.scale})`
      setTimeout(() => {
        el.style.transform = 'scale(1)'
      }, 500);
    }
    
  }
});
app.mount("#app");