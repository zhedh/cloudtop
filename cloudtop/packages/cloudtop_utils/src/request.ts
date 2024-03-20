export enum MethodTypes {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * XMLHttpRequest
 * @param method 请求方法
 * @param url qingqing
 * @param data
 * @returns
 */
const xhr = (method: MethodTypes, url: string, data: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest()
      xhr.open(method, url)

      if (method === MethodTypes.POST) {
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        )
        xhr.send(new URLSearchParams(data))
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send()
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          resolve(JSON.parse(xhr.response))
        } else {
          new Error(xhr.response)
        }
      }
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * sendBeacon 上传
 * @param url - 请求地址
 * @param data - 请求数据
 * @returns {boolean}
 */
export const sendBeacon = (url: string, data: Record<string, any>): boolean =>
  navigator.sendBeacon(url, JSON.stringify(data))

/**
 * 图片方式上传
 * @param url - 请求地址
 * @param data - 请求数据
 */
export const sendFromImg = (url: string, data: Record<string, any>) => {
  let image: HTMLImageElement | null = new Image()
  const s = url.indexOf('?') === -1 ? '?' : '&'

  image.src = `${url}${s}data=${encodeURIComponent(JSON.stringify(data))}`
  image = null
}

/**
 * GET 请求上报
 * @param url - 请求地址
 * @param data - 请求数据
 * @returns {Promise}
 */
export const sendFromGet = (url: string, data: Record<string, any>) =>
  xhr(MethodTypes.GET, url, data)

/**
 * POST 请求上报
 * @param url - 请求地址
 * @param data - 请求数据
 * @returns
 */
export const sendFromPost = (url: string, data: Record<string, any>) =>
  xhr(MethodTypes.POST, url, data)
