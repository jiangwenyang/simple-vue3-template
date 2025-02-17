<template>
  <NBreadcrumb>
    <NBreadcrumbItem v-for="item in matchedMenu" :key="item.name || item.title">
      <NDropdown :options="getOptions(item.siblings)" @select="handleSelectSibling">
        <div class="trigger" @click="handleGo(item)">{{ item.title || item.name }}</div>
      </NDropdown>
    </NBreadcrumbItem>
  </NBreadcrumb>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'naive-ui'
import type { RouteLocationMatched, RouteRecordRaw } from 'vue-router'
import { useResourceStore } from '@/stores/useResourceStore'
import type { FlatResource } from '@/stores/useResourceStore'
interface BreadcrumbItem {
  title: string
  path?: string
  name: string
  siblings?: BreadcrumbItem[]
  disabled?: boolean
}
const route = useRoute()
const router = useRouter()
const resourceStore = useResourceStore()

// 从路由生成面包屑
const getBreadcrumbFromRoutes: (
  routes: RouteLocationMatched[] | RouteRecordRaw[],
) => BreadcrumbItem[] = (routes) =>
  routes.reduce((result, item, index, arr) => {
    if (item.meta?.title) {
      result.push({
        title: item.meta?.title,
        path: item.path,
        name: item.name,
        siblings:
          arr[index - 1] && arr[index - 1].children
            ? getBreadcrumbFromRoutes(
                [...arr[index - 1].children!].filter((child) => child.path !== item.path),
              )
            : [],
      } as BreadcrumbItem)
    }
    return result
  }, [] as BreadcrumbItem[])

// 从菜单生成面包屑
const getBreadcrumbFromMenus: (menus: FlatResource[]) => BreadcrumbItem[] = (
  menus: FlatResource[],
) =>
  menus.map((item) => ({
    title: item.label || item.name,
    name: item.url,
    siblings: item.siblings ? getBreadcrumbFromMenus(item.siblings) : [],
  }))

const getOptions = (breadcrumbs?: BreadcrumbItem[]) => {
  if (!(breadcrumbs && breadcrumbs.length)) {
    return
  }
  return breadcrumbs.map((item) => ({
    label: item.title || item.name,
    key: item.name,
    data: item,
  }))
}

const matchedMenu = computed(() => {
  const matchedRoute = [...route.matched]
  const hasMatchedRoutes = []
  let matchedMenu: FlatResource | null = null
  let breadcrumbs: BreadcrumbItem[] = []

  while (matchedRoute.length) {
    const tryRoute = matchedRoute.pop()
    if (!tryRoute) {
      break
    }
    hasMatchedRoutes.unshift(tryRoute)
    const menuItem = resourceStore.flatResourceMenu.find(
      (item) => item.url === tryRoute?.meta.authCode,
    )
    if (menuItem) {
      matchedMenu = menuItem
      break
    }
  }

  // 如果有匹配菜单，则使用菜单作为面包屑数据
  if (matchedMenu) {
    const hasRouteNotInMenu = hasMatchedRoutes.length > 1
    breadcrumbs = getBreadcrumbFromMenus([...(matchedMenu.parents || []), matchedMenu])

    if (hasRouteNotInMenu) {
      const routeMenu: BreadcrumbItem[] = getBreadcrumbFromRoutes(hasMatchedRoutes)
      breadcrumbs.push(...routeMenu)
    }
  } else {
    // 否则直接使用匹配路由
    breadcrumbs = getBreadcrumbFromRoutes(route.matched)
  }

  const lastBreadcrumbs = breadcrumbs[breadcrumbs.length - 1]

  if (lastBreadcrumbs) {
    lastBreadcrumbs.disabled = true
  }

  return breadcrumbs
})

const handleGo = (item: BreadcrumbItem) => {
  if (item.disabled) {
    return
  }
  try {
    if (item.name) {
      router.push({ name: item.name })
    } else if (item.path) {
      router.push({ path: item.path })
    }
  } catch (error) {
    router.push('/404')
  }
}

const handleSelectSibling = (key: string | number, option: DropdownOption) => {
  const { data } = option
  handleGo(data as BreadcrumbItem)
}
</script>
