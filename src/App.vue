<template>
  <AppProvider>
    <APPView />
  </AppProvider>
</template>

<script lang="ts" setup>
import AppProvider from './AppProvider.vue'
import APPView from './APPView.vue';
document.title = import.meta.env.VITE_APP_TITLE || '项目名称'
</script>
