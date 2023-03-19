import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/Home/index.vue'
import Benchmark from '@/pages/Benchmark/index.vue'

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
    component: Home,
  },
  {
    path: '/explorer/',
    name: 'explorer',
    component: () => import('@/pages/explorer/index.vue'),
  },
  {
    path: '/explorer-block-list/',
    name: 'explorer-block-list',
    component: () => import('@/pages/explorer/all-block-list.vue'),
  },
  {
    path: '/explorer-transaction-list/',
    name: 'explorer-transaction-list',
    component: () => import('@/pages/explorer/all-transaction-list.vue'),
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
