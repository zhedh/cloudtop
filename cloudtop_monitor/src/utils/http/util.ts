import { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import { storageGet } from '../storage'

interface RequestConfig<T> extends InternalAxiosRequestConfig<T> {
  'Project-Code': string
  'Project-Env': string
}

export const userAuthValidation = (response: AxiosResponse) => {
  const { code } = response.data

  /**
   * 验证用户身份是否过期
   *  接口返回401
   */
  if (+code === 401) {
    // TODO
  }
}

export const requestInterceptor = (
  config: InternalAxiosRequestConfig<unknown>
) => {
  const token = Cookies.get('TOKEN')
  const { projectCode, projectEnv } = storageGet('PROJECT') || {}

  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token,
      'Project-Code': projectCode,
      'Project-Env': projectEnv,
    },
  } as unknown as RequestConfig<unknown>
}
