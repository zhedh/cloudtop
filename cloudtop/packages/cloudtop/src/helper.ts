import { generateUUID } from '@cloudtop/utils'
import { RouteModeType } from './types'

const UID_KEY = '__CLOUDTOP_UID__'

/**
 * 获取 UID
 * @returns {string}
 */
export const getUid = (): string => {
  let uid = localStorage.getItem(UID_KEY)
  if (uid) return uid

  uid = generateUUID()
  localStorage.setItem(UID_KEY, uid)

  return uid
}

/**
 * 获取页面 PATH
 * @param routeMode
 * @returns {string} pathname
 */
export const getPathname = (routeMode: RouteModeType): string => {
  const { pathname } = window.location

  switch (routeMode) {
    case 'history':
      return pathname

    case 'hash':
      const reg = /^#(.*)\?/
      const [_, path] = reg.exec(window.location.hash) || []
      return path ?? ''

    default:
      return pathname
  }
}

/**
 * 获取网络连接类型
 * iOS 目前不支持获取
 * @returns
 */
export const getNetworkType = (): string => {
  const navigator: Record<string, any> = window.navigator
  if (navigator) {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection

    if (connection && connection.effectiveType) {
      return connection.effectiveType
    }
  }

  return 'unknown'
}
