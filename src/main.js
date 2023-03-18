import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TBSApi from './api'

import 'uno.css'

import '@/theme/dark/index.scss'

const app = createApp(App)
app.provide('TBSApi', new TBSApi('goerli'))
app.use(router).mount('#app')
