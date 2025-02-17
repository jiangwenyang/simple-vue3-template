import router from '@/routers'
import { login } from '@/services/auth'
export interface ILoginParams {
  account: string
  loginSource: number | string
  encPassword: string
}

export const useUserStore = defineStore(
  'userStore',
  () => {
    const token = ref<string>('')
    const userInfo = ref<any>(null)

    const isAuthenticated = computed(() => !!(token.value && userInfo.value))

    const clearToken = () => {
      token.value = ''
    }

    const clearUserInfo = () => {
      userInfo.value = {
        username: '',
      }
    }
    const userLogin = async (params: ILoginParams) => {
      const { data, token } = await login(params)

      if (token) {
        setToken(token)
      }

      setUserInfo({
        ...data,
      })
      await router.push({
        path: '/',
      })
      window.$message.success('登录成功～')
    }

    const userLogout = async () => {
      console.log('userLogout ---> clearToken')
      localStorage.clear()
      clearToken()
      clearUserInfo()
      await router.push({
        path: '/login',
      })
    }

    const setToken = (value: string) => {
      // 保存token
      localStorage.setItem('token', value)
      token.value = value
    }
    const setUserInfo = (value: any) => {
      // 保存token
      userInfo.value = value
    }

    // 重置store
    const resetStore = () => {
      token.value = ''
      userInfo.value = null
    }

    return { token, userInfo, isAuthenticated, userLogout, userLogin, resetStore }
  },
  {
    persist: true,
  },
)
