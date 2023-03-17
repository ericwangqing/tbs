import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/Home/index.vue'

const routes = [
  {
    path: '/home/',
    name: 'home',
    component: Home,
  },
  {
    path: '/',
    redirect: () => {
      return { name: 'home' }
    },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' },
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
