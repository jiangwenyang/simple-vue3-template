<template>
  <NMenu
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
    :render-label="renderMenuLabel"
    :render-icon="renderMenuIcon"
    :expand-icon="expandIcon"
  />
</template>

<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import BookmarkOutline from '~icons/ion/bookmark-outline'
import CaretDownOutline from '~icons/ion/caret-down-outline'
import { NIcon } from 'naive-ui'
import { useResourceStore } from '@/stores/useResourceStore'
import type { Resource } from '@/stores/useResourceStore'

const router = useRouter()
const resourceStore = useResourceStore()

const getMenuOptionsFromResource = (resourceMenu: Resource[]) =>
  resourceMenu.map((item) => {
    const { id, name, childNode } = item

    const menuOption: MenuOption = {
      label: name,
      key: id,
      data: item,
    }

    if (childNode && childNode.length) {
      menuOption.children = getMenuOptionsFromResource(childNode)
    }

    return menuOption
  })

const menuOptions = computed(() => getMenuOptionsFromResource(resourceStore.resourceMenu))

const handleGo = (data: Resource) => {
  try {
    if (data.name) {
      router.push({ name: data.name })
    }
  } catch (error) {
    router.push('/404')
  }
}

const renderMenuLabel = (option: MenuOption) => {
  if ('href' in option) {
    return h('a', { href: option.href, target: '_blank' }, option.label as string)
  }
  return h('div', { onClick: () => handleGo(option.data as Resource) }, option.label as string)
}
const renderMenuIcon = (option: MenuOption) => {
  // 渲染图标占位符以保持缩进
  if (option.key === 'sheep-man') return true
  // 返回 falsy 值，不再渲染图标及占位符
  if (option.key === 'food') return null
  return h(NIcon, null, { default: () => h(BookmarkOutline) })
}
const expandIcon = () => {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}
</script>
