import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/Home/index.vue'
import Benchmark from '@/pages/Benchmark/index.vue'
import Security from '@/pages/Security/index.vue'

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
  },
  {
    path: '/benchmark/',
    name: 'benchmark',
    component: Benchmark,
  },
  {
    path: '/security/',
    name: 'security',
    component: Security,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
