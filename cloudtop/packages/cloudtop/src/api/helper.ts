import { ApiLogData } from '../types'

class ListenEvent<T = any> {
  callbacks: ((data: T) => void)[]

  constructor() {
    this.callbacks = []
  }

  dispatch(data: T) {
    this.callbacks.forEach((callback) => callback(data))
  }

  addListener(callback: (data: T) => void) {
    this.callbacks.push(callback)
  }

  removeListener(callback: (data: T) => void) {
    const index = this.callbacks.findIndex((c) => c === callback)
    if (index > -1) {
      this.callbacks.splice(index, 1)
    }
  }
}

export const apiEvent = new ListenEvent<ApiLogData>()

export const apiIntercept = (status: number, url: string) => {
  /**
   * 状态码为0不上报
   */
  if (status === 0) {
    return true
  }

  /**
   * 资源请求不上报
   */
  const path = url?.split('?')[0]
  const reg = /https?:\/\/.+\/.*\.([^/.]+)$/
  if (reg.test(path)) {
    return true
  }

  return false
}
