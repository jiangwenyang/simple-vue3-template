import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

// 默认路由
const defaultRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path:'/unauthorized',
    component: () => import('@/views/unauthorized/index.vue'),
  },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/404/index.vue') },
]

// 业务路由
const bussnessRoutes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/home/index.vue'),
      },
      {
        path: '/test-view1',
        meta: {
          title: '测试页面1',
          requireAuth: true, // 是否需要鉴权
          authCode: 'test-view1', // 权限编码（使用admin中配置的url参数作为权限编码）
        },
        component: () => import('@/views/test-view1/index.vue'),
        children: [
          {
            path: 'test-view1-1',
            meta: {
              title: '测试页面1-1',
              requireAuth: true, // 是否需要鉴权
              // authCode: 'test-view1-1', // 权限编码（使用admin中配置的url参数作为权限编码）
              authCode: 'pages/infoPublish/infoExamine.html',
            },
            component: () => import('@/views/test-view1-1/index.vue'),
          },
        ],
      },
      {
        path: '/test-view2',
        meta: {
          title: '测试页面2',
          requireAuth: true, // 是否需要鉴权
          authCode: 'test-view', // 权限编码（使用admin中配置的url参数作为权限编码）
        },
        component: () => import('@/views/test-view2/index.vue'),
      },
    ],
  },
]

export default [...bussnessRoutes, ...defaultRoutes] as Readonly<RouteRecordRaw[]>
