import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/Home/index.vue'
import Benchmark from '@/pages/Benchmark/index.vue'
import BlockChain from '@/pages/Shard/index.vue'

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
    path: '/explorer',
    component: () => import('@/pages/Explorer/index.vue'),
    children: [
      {
        path: '',
        redirect: {
          name: 'explorer-block-list',
        },
      },
      {
        path: 'block-list',
        name: 'explorer-block-list',
        component: () => import('@/pages/Explorer/block-list.vue'),
      },
      {
        path: 'transaction-list',
        name: 'explorer-transaction-list',
        component: () => import('@/pages/Explorer/transaction-list.vue'),
      },
      {
        path: 'block/:blockNumber',
        name: 'explorer-block-detail',
        component: () => import('@/pages/Explorer/block-detail.vue'),
      },
      {
        path: 'transaction/:hash',
        name: 'explorer-transaction-detail',
        component: () => import('@/pages/Explorer/transaction-detail.vue'),
      },
      {
        path: 'address/:hash',
        name: 'explorer-address-detail',
        component: () => import('@/pages/Explorer/address-detail.vue'),
      },
    ],
  },
  {
    path: '/blockchain/',
    name: 'blockchain',
    component: BlockChain
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
