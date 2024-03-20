interface StorageType {
  /**
   * Storage 存储的值
   */
  value: any
  /**
   * Storage 过期时间（毫秒）
   */
  expires: number
}

/**
 * 默认过期时间 100 年，相当于永久
 */
const EXPIRES_TIME = 60 * 60 * 24 * 365 * 100

/**
 * 验证本地存储是否过期
 *
 * @param expires
 * @returns
 */
function isExpires(expires: number): boolean {
  return +new Date() > +expires
}

/**
 * 获取本地存储，过期返回null
 *
 * @param key
 * @returns
 */
export function storageGet<T = any>(key: string): T | any {
  const s = localStorage.getItem(key)
  if (!s) return null

  const { value, expires }: StorageType = JSON.parse(s)
  return isExpires(expires) ? null : value
}

/**
 * 设置本地存储内容
 *
 * @param key
 * @param value
 * @param time 过期时间，单位秒
 * @returns
 */
export function storageSet<T = any>(
  key: string,
  value: T,
  time = EXPIRES_TIME
) {
  if (!value && value !== 0) return

  if (typeof time !== 'number') {
    time = EXPIRES_TIME
  }

  localStorage.setItem(
    key,
    JSON.stringify({
      value,
      expires: +new Date() + time * 1000,
    })
  )
}

/**
 * 移除本地存储
 *
 * @param key
 */
export function storageRemove(key: string) {
  localStorage.removeItem(key)
}

/**
 * 移除全部本地存储
 *
 * @param key
 */
export function storageClear() {
  localStorage.clear()
}
