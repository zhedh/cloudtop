import { message } from 'antd'
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { requestInterceptor, userAuthValidation } from './util'
import config from './config'

const instance: AxiosInstance = axios.create(config)

instance.interceptors.request.use(requestInterceptor)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 响应处理
    userAuthValidation(response)
    return response.data
  },
  (error) => {
    // 异常处理
    message.error(error)
    console.log(error)
  }
)

export const http = instance
