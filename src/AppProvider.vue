<template>
  <NConfigProvider
    :theme="theme"
    :themeOverrides="themeOverrides"
    :locale="zhCN"
    :date-locale="dateZhCN"
    preflightStyleDisabled
  >
    <NMessageProvider>
      <NNotificationProvider>
        <slot />
      </NNotificationProvider>
    </NMessageProvider>
    <!-- 同步 body 元素的样式 -->
    <NGlobalStyle />
  </NConfigProvider>
</template>
<script setup lang="ts">
import { useQueryProvider } from 'vue-query'
import { zhCN, dateZhCN, darkTheme, lightTheme } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'
import { logger } from '@/libs/log'
import { useThemeStore } from '@/stores/useThemeStore'
// 在这里注入全局的接口
useQueryProvider()
window.$logger = logger

const themeStore = useThemeStore()

// 根据 currentTheme 来确定 Naive UI 的主题配置
const theme = computed(() => (themeStore.currentTheme === 'light' ? lightTheme : darkTheme))

const themeOverrides = computed<GlobalThemeOverrides>(() =>
  themeStore.currentTheme === 'light'
    ? { common: { bodyColor: '#f7fafc' }, base: { primaryColor: '#2563eb' } }
    : { common: { bodyColor: '#1a202c' }, base: { primaryColor: '#134871' } },
)
</script>
