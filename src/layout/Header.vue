<template>
  <div class="h-full flex justify-between items-center px-2">
    <div class="flex items-center">
      <h1>{{ appSlogan }}</h1>
      <Breadcrumb class="ml-2"/>
    </div>



    <NButton @click="themeStore.toggleTheme">{{
      themeStore.currentTheme === 'light' ? '切换暗色' : '切换亮色'
    }}</NButton>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/stores/useThemeStore'
import Breadcrumb from './Breadcrumb.vue'

const appSlogan = import.meta.env.VITE_APP_SLOGAN
const themeStore = useThemeStore()
</script>
