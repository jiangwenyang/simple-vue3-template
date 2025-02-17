import axios from 'axios'

import type { AxiosResponse, AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'

import { ErrorEnum, ErrorDetails } from '@/enums/ErrorEnum'
import { useUserStore } from '@/stores/useUserStore'

/**
 * 请求响应接口
 */
export interface ApiResponse<D = any> {
  code?: number
  data?: D
  desc: string
  success: boolean
  token?: string
}

/**
 * 接口返回 Promise 类型
 */
export type ApiPromise<T = any> = Promise<ApiResponse<T>>

class Request {
  // axios实例
  instance: AxiosInstance
  // 用于存储控制器对象
  abortControllerMap: Map<string, AbortController>
  // 构造函数
  constructor(config?: CreateAxiosDefaults) {
    // 创建axios实例
    this.instance = axios.create(config)
    // 用于存储控制器对象
    this.abortControllerMap = new Map()
    // 设置拦截器
    this.setInterceptors(this.instance)
  }

  // 请求
  async request(config: AxiosRequestConfig): ApiPromise {
    return await this.instance(config)
  }

  /**
   *
   * 处理请求
   * @param res - 响应
   */
  async handleResponse(res: AxiosResponse<ApiResponse>) {
    const { userLogout } = useUserStore()
    const url = res.config.url ?? ''
    // 请求完成后，将控制器实例从Map中移除
    this.abortControllerMap.delete(url)
    if (axios.isCancel(res)) {
      console.log('Request canceled', res)
      return await Promise.reject(res)
    }
    if (res.status === 200) {
      const code: 200 | 0 | ErrorEnum = Number(res.data.code) as 200 | 0 | ErrorEnum

      if (code === 200 || code === 0) {
        return await Promise.resolve(res.data)
      } else {
        if (code in ErrorEnum) {
          window.$message.warning(ErrorDetails[code].message)
        } else {
          window.$message.warning(res.data.desc || 'Unknown error')
        }
        if (code === 401) {
          userLogout()
        }
        return await Promise.reject(res.data)
      }
    } else {
      window.$message.warning(
        res.message || res.data.message || res.response.statusText || '服务繁忙，请重试~',
      )
    }
    return await Promise.reject(res)
  }

  // 拦截器
  setInterceptors(request: AxiosInstance) {
    // 请求拦截器
    request.interceptors.request.use((config) => {
      const { token } = useUserStore()
      // toDo 也可以在这里做一个重复请求的拦截
      // https://github.com/axios/axios/tree/main#abortcontroller
      // 请求url为key
      const url = config.url ?? ''
      // 实例化控制器
      const controller = new AbortController()
      // 将控制器实例与请求绑定
      config.signal = controller.signal
      // 将控制器实例存储到Map中
      this.abortControllerMap.set(url, controller)
      // 设置请求头
      if (config && config.headers && token) {
        config.headers.set('Token', token)
      }
      return config
    })
    // 响应拦截器
    request.interceptors.response.use(
      async (res) => {
        return await this.handleResponse(res)
      },
      async (res) => {
        return await this.handleResponse(res)
      },
    )
  }

  // 取消全部请求
  cancelAllRequest() {
    for (const [, controller] of this.abortControllerMap) {
      // 取消请求
      controller.abort()
    }
    this.abortControllerMap.clear()
  }

  /**
   * 取消指定的请求
   * @param url - 待取消的请求URL
   */
  cancelRequest(url: string | string[]) {
    const urlList = Array.isArray(url) ? url : [url]
    for (const _url of urlList) {
      // 取消请求
      this.abortControllerMap.get(_url)?.abort()
      this.abortControllerMap.delete(_url)
    }
  }
}

const instance = new Request({
  baseURL: import.meta.env.VITE_API_URL,
})

// 请求
export const request = async (config: AxiosRequestConfig): ApiPromise => {
  return await instance.request(config)
}

// 取消请求
export const cancelRequest = (url: string) => {
  instance.cancelRequest(url)
}

export default Request
