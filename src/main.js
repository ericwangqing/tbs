import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import TBSApi from './api'

import 'uno.css'

import '@/theme/dark/index.scss'

const app = createApp(App)
const network = 'goerli'
app.provide('TBSApi', new TBSApi())

app.use(router).mount('#app')
