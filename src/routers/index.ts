import { createWebHashHistory, createRouter } from 'vue-router'

import { routerGuard } from './helper'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

// 设置路由守卫
routerGuard(router)

export default router
