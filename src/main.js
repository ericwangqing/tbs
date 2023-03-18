import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'uno.css'

import '@/theme/dark/index.scss'

createApp(App).use(router).mount('#app')
