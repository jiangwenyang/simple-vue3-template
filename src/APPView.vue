<template>
  <RouterView v-slot="{ Component }">
    <Transition>
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<script setup lang="ts">
// naivi-ui的限制，useMessage只能在NMessageProvider内调用
import { useMessage } from 'naive-ui'
window.$message = useMessage()
</script>
