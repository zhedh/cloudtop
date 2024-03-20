import { message } from 'antd'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { requestInterceptor, userAuthValidation } from './util'
import config from './config'

const instance: AxiosInstance = axios.create(config)

instance.interceptors.request.use(requestInterceptor)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data

    if (+code !== 200 && +code !== 0 && code) {
      userAuthValidation(response)
      message.error(msg)
      throw response.data
    }
    return response.data
  },
  (error) => {
    console.log(error)
    message.error(error.message || '网络错误')
    throw error
  }
)

export const httpCatch = instance
