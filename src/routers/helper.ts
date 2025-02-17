import pinia from '@/stores'; // 引入pinia实例

import routes from './routes';

import type { Router } from 'vue-router';

import { useResourceStore } from '@/stores/useResourceStore';
import { useUserStore } from '@/stores/useUserStore';

const whitePathList = ['/404']
export const routerGuard = (router: Router) => {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    const isToLogin = to.path === '/login'

    const { isAuthenticated } = useUserStore(pinia)
    const { getResource, hasFetchResource, resourceMenuCodes } = useResourceStore(pinia)

    // 白名单
    if (whitePathList.includes(to.path)) {
      next()
      return
    }

    // 判断用户是否登录
    if (isAuthenticated) {
      // 已登录访问登录页面，直接跳转到首页
      if (isToLogin) {
        next('/')
        return
      }

      // 未获取过权限资源
      if (!hasFetchResource) {
        await getResource()
      }


      // 跳过所有鉴权，仅临时开发使用
      if (import.meta.env.VITE_APP_SKIP_AUTH === 'true') {
        next()
        return
      }

      // 当前路由需要鉴权
      if (to.meta.requireAuth) {
        // 否则进行权限检查
        if (
          resourceMenuCodes &&
          resourceMenuCodes.length &&
          resourceMenuCodes.includes(to.meta.authCode as string)
        ) {
          // 有权限
          next()
        } else {
          // 无权限
          next('/unauthorized')
        }
      } else {
        // 当前路由无需鉴权
        next()
      }
    } else {
      // 未登录，跳转到登录页
      if (isToLogin) {
        // 已经是跳转登录页，直接跳转
        next()
      } else {
        next('/login')
      }
    }
  })
}
