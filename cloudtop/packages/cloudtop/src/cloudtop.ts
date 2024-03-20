import {
  generateUUID,
  sendBeacon,
  sendFromImg,
  sendFromPost,
} from '@cloudtop/utils'
import { getNetworkType, getPathname, getUid } from './helper'
import { Config, EnvType, ReportType, RouteModeType, LogData } from './types'
import { listenError, listenPromiseError } from './error'
import { handlePV } from './pv'
import { reportPerf } from './perf'
import { reportApi } from './api'

class Cloudtop {
  baseURL: string
  clientIp: string
  projectId: string
  env: EnvType
  sessionId: string
  loginId?: string
  extend?: string | Record<string, any>
  pvId: string
  reportType: ReportType
  routeMode: RouteModeType
  page: string

  constructor(options: Config) {
    if (!options.baseURL) {
      console.error('baseURL 未配置，前端性能监控上报不生效')
      return
    }

    if (!options.projectId) {
      console.error('projectId 未配置，前端性能监控上报不生效')
      return
    }

    /** 初始化配置参数 */
    this.baseURL = options.baseURL
    this.clientIp = options.clientIp ?? ''
    this.projectId = options.projectId
    this.env = options.env ?? 'production'
    this.sessionId = options.sessionId ?? ''
    this.loginId = options.loginId ?? ''
    this.extend = options.extend ?? ''
    this.reportType = options.reportType ?? 'beacon'
    this.routeMode = options.routeMode ?? 'history'
    this.pvId = generateUUID()
    this.page = getPathname(this.routeMode)

    /** 初始化执行函数 */
    this.bootstrap()
  }

  setConfig(options: {
    clientIp: string
    sessionId: string
    loginId: string
    extend: string | Record<string, any>
  }) {
    this.clientIp = options.clientIp ?? this.clientIp
    this.sessionId = options.sessionId ?? this.sessionId
    this.loginId = options.loginId ?? this.loginId
    this.extend = options.extend ?? this.extend
  }

  /**
   * 获取公共字段
   */
  private getCommonData() {
    const { clientWidth = 0, clientHeight = 0 } = document.body || {}
    const { width, height } = window.screen || {}
    const extend =
      typeof this.extend === 'string'
        ? this.extend
        : JSON.stringify(this.extend)

    return {
      reportTime: +new Date(),
      pid: this.projectId,
      env: this.env,
      clientIp: this.clientIp,

      ct: getNetworkType(),
      pvId: this.pvId,
      page: this.page ?? getPathname(this.routeMode),
      src: window.location.href,
      sr: width + '*' + height,
      vp: clientWidth + '*' + clientHeight,

      sid: this.sessionId,
      uid: getUid(),
      loginId: this.loginId,
      ext: extend,
    }
  }

  private async report(data: LogData) {
    const record = { ...this.getCommonData(), ...data }

    // 默认使用 beacon 发送请求
    if (this.reportType === 'beacon' && navigator.sendBeacon) {
      return sendBeacon(this.baseURL, record)
    }

    // 请求实体长度较短，不超过浏览器安全限制，使用 img 请求
    // IE6、7、8（部分）的URL长度不能超过 2083 的字符长度，URL中的path部分不能超过 2048
    const dateLength = JSON.stringify(record).length
    if (this.reportType === 'img' || dateLength < 2000) {
      return sendFromImg(this.baseURL + '/log.png', record)
    }

    return sendFromPost(this.baseURL, record)
  }

  routeChange(path?: string) {
    // 路由相同，不重新上报PV
    if (path && path === this.page) return

    this.pvId = generateUUID()
    this.page = path ?? getPathname(this.routeMode)

    handlePV(this.report.bind(this))
  }

  bootstrap() {
    // 初始 pv 上报
    this.routeChange()

    // 监听 error 错误上报
    listenError(this.report.bind(this))

    // 监听 promise 错误上报
    listenPromiseError(this.report.bind(this))

    // 页面加载性能上报
    reportPerf(this.report.bind(this))

    // 接口日志上报
    reportApi(this.report.bind(this), this.baseURL)
  }
}

export default Cloudtop
