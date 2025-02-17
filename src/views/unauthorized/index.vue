<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <NEmpty size="huge" description="你暂无当前功能权限，请联系管理员">
      <template #extra>
        <NButton size="small" @click="router.push('/')"> 返回首页 </NButton>
      </template>
    </NEmpty>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter()
</script>
