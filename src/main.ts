import { createApp } from 'vue'
import { VueQueryPlugin } from 'vue-query'

import App from '@/App.vue'
import router from '@/routers'
import pinia from '@/stores'
import { appInfo } from '@/libs'

import '@/styles/index.scss'

// naive-ui字体
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

// naive-ui可能和tailwind reset有样式冲突
// https://www.naiveui.com/zh-CN/os-theme/docs/style-conflict
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

// 在开发者工具中显示构建信息
appInfo()

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
