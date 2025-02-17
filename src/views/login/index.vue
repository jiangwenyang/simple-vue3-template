<template>
  <div>
    <div>Login</div>
    <h1>{{ appName }}</h1>
    <p>{{ slogan }}</p>
    <NForm :model="loginFormData">
      <NFormItem label="账号" prop="account">
        <NInput v-model:value="loginFormData.account" />
      </NFormItem>
      <NFormItem label="密码" prop="password">
        <NInput v-model:value="loginFormData.password" />
      </NFormItem>
      <NButton icon="el-icon-user" @click="handleLogin">登录</NButton>
    </NForm>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores/useUserStore'

import aes from '@/libs/aes'
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
const appName = import.meta.env.VITE_APP_NAME
const slogan = import.meta.env.VITE_APP_SLOGAN
const loginFormData = ref({
  account: 'jiangwenyang',
  password: 'cmnit@Jwy1234',
})
const userStore = useUserStore()
const handleLogin = async () => {
  await userStore.userLogin({
    account: loginFormData.value.account,
    loginSource: 1,
    encPassword: aes.encrypt(loginFormData.value.password),
  })
}
</script>
