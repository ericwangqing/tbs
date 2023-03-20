import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TBSApi from './api'
import '@/assets/iconfont/iconfont.css'

import 'uno.css'
import { BigNumber } from 'ethers'

import '@/theme/dark/index.scss'

const app = createApp(App)
const network = 'goerli'

const TBSApiInstance = new TBSApi()
app.provide('TBSApi', TBSApiInstance)

app.config.globalProperties.$hex2number = function (hash) {
  return BigNumber.from(hash).toNumber()
}
app.use(router).mount('#app')
