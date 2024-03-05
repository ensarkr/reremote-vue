import { createRouter, createWebHistory } from "vue-router"
import LogsPageVue from "@/views/LogsPage.vue"
import ButtonsPageVue from "@/views/ButtonsPage.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "logs",
      component: LogsPageVue
    },
    {
      path: "/buttons",
      name: "buttons",
      component: ButtonsPageVue
    }
  ]
})

export default router
