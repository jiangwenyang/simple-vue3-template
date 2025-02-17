<template>
  <NLayout position="absolute">
    <NLayoutHeader bordered style="height: 48px;">
      <Header />
    </NLayoutHeader>
    <NLayout has-sider position="absolute" style="top: 48px;">
      <NLayoutSider
        bordered
        show-trigger
        show-collapsed-content
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
      >
        <Sider />
      </NLayoutSider>
      <NLayout>
        <RouterView v-slot="{ Component }">
          <Transition>
            <KeepAlive>
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </NLayout>
    </NLayout>
  </NLayout>
</template>

<script setup lang="ts">
import Header from './Header.vue';
import Sider from './Sider.vue';
</script>
