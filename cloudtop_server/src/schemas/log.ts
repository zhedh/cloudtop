import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../database/mysql/connection'
import { LogType } from '../types/log'

class Log extends Model {
  declare id: number
  declare pid: string // 应用ID或应用名称、标识应用唯一值
  declare type: LogType // 日志类型
  declare reportTime: number // 上报时间
  declare date: number // 默认上报时间，其次取服务器时间
  declare env: string // 环境 -> prod

  declare ct: string // 网络类型
  declare httpReferer: string // 页面Referer
  declare httpUserAgent: string // 浏览器UserAgent
  declare browser: string // 浏览器类型 -> safari
  declare browserVersion: string // 浏览器版本 -> 14.1.1
  declare device: string // 设备类型 -> mac
  declare engine: string // 浏览器引擎 -> webkit
  declare engineVersion: string // 浏览器引擎版本 -> 605.1.15
  declare os: string // 操作系统 -> macos
  declare osVersion: string // 操作系统版本 -> 10.15.7
  declare deviceType: string // 设备类型 -> pc、mobile

  declare ipIsp: string // 运营商 -> 联通
  declare ipCountry: string // 国家名称 -> 中国
  declare ipCountryId: string // 国家ID -> CN
  declare ipRegion: string // 省级行政区 -> 北京市
  declare ipRegionId: string // 省级行政区ID -> 110000
  declare ipRegionName: string // 省级行政区 -> 北京市
  declare ipCity: string // 城市名称 -> 北京市
  declare ipCityId: string // 城市ID -> 110100
  declare ipCityName: string // 城市名称 -> 北京市
  declare remoteAddr: string // 客户端IP地址

  declare sid: string // Session ID
  declare sr: string // 屏幕分辨率
  declare url: string // 被监控目标地址
  declare uid: string // 用户ID
  declare vp: string // 页面大小

  declare page: string // 页面 -> testing
  declare pvId: string // PV ID -> bkkRsrej4OFdv2d4yeb37Xb2R2Xp

  /**
   * 扩展数据
   */
  declare loginId?: string // 用户登录ID，可以是手机号、邮箱等，根据应用自定义
  declare ext?: string // 扩展字段，不要超过100个字符 -> String | JSON.stringify(ext)


  /**
   * PV 数据
   */
  declare dt: string // 文档标题
  declare dr: string // 文档Referrer
  declare de: string // 文档编码类型
  declare dpr: string // 屏幕像素比
  declare lang: string // 文档语言

  /**
   * Error 数据
   */
  declare category: string // 错误类型名称，默认为CustomError -> ReferenceError
  declare msg: string // 错误消息，最大支持1000个字符
  declare stack: string // 错误堆栈信息，最大支持1000个字符
  declare file: string // 报错JS所属文件
  declare line: number // 报错发生行
  declare col: number // 报错发生列
  declare error: string // 错误详情 -> JSON.stringify(error)

  /**
   * Resource Error 数据
   */
  declare src: string // 资源地址 -> http://example/unknown/picture.jpg
  declare nodeName: string // 发生错误的HTML节点类型 -> img
  declare xpath: string // 发生错误位置 -> html. > body. > img.
  declare resType: string // 错误资源类型 -> img
  declare resName: string // 错误资源名称 -> /unknown/picture.jpg
  declare domain: string // 错误资源域名 -> example

  /**
   * Perf Error 数据
   */
  declare redirectTime: number // 重定向耗时（毫秒，下面字段涉及到耗时的单位都是毫秒）
  declare appDns: number // APP_DNS耗时
  declare dns: number // DNS连接耗时
  declare tcp: number // TCP连接耗时
  declare ssl: number // SSL连接耗时
  declare ttfb: number // 网络请求耗时。等待接收响应的第一个字节所花费的时间
  declare trans: number // 数据传输耗时
  declare dom: number // DOM解析耗时
  declare res: number // 资源加载耗时
  declare firstbyte: number // First Byte时间
  declare fpt: number // 首次渲染时间
  declare tti: number // 首次可操作时间
  declare ready: number // HTML加载完成时间，即DOM Ready时间
  declare load: number // 从开始加载到完全加载时间
  // fmp: number // 首次有效绘制时间（暂时不用，使用lcp替代）
  declare lcp: number // 最大内容绘制时间

  /**
   * API Error 数据
   */
  declare api: string // API地址
  declare success: 1 | 0 // 请求是否成功 1：成功 2：失败
  declare status: number // 请求返回状态码
  // declare msg: string // 返回的消息体
  declare time?: number // API耗时，单位为ms
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    pid: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    reportTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'report_time',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    env: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },

    ct: {
      type: DataTypes.STRING(16),
      defaultValue: '',
    },
    httpReferer: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
      field: 'http_referer',
    },
    httpUserAgent: {
      type: DataTypes.STRING(2048),
      defaultValue: '',
      field: 'http_user_agent',
    },
    browser: {
      type: DataTypes.STRING(32),
      defaultValue: '',
    },
    browserVersion: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'browser_version',
    },
    device: {
      type: DataTypes.STRING(32),
      defaultValue: '',
    },
    engine: {
      type: DataTypes.STRING(32),
      defaultValue: '',
    },
    engineVersion: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'engine_version',
    },
    os: {
      type: DataTypes.STRING(32),
      defaultValue: '',
    },
    osVersion: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'os_version',
    },
    deviceType: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'device_type',
    },


    ipIsp: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_isp',
    },
    ipCountry: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_country',
    },
    ipCountryId: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_country_id',
    },
    ipRegion: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_region',
    },
    ipRegionId: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_region_id',
    },
    ipRegionName: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_region_name',
    },
    ipCity: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_city',
    },
    ipCityId: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_city_id',
    },
    ipCityName: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'ip_city_name',
    },
    remoteAddr: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'remote_addr',
    },

    sid: {
      type: DataTypes.STRING(64),
      defaultValue: '',
    },
    sr: {
      type: DataTypes.STRING(16),
      defaultValue: '',
    },
    url: {
      type: DataTypes.STRING(2083),
      defaultValue: '',
    },
    uid: {
      type: DataTypes.STRING(64),
      defaultValue: '',
    },
    vp: {
      type: DataTypes.STRING(16),
      defaultValue: '',
    },

    loginId: {
      type: DataTypes.STRING(64),
      field: 'login_id',
      defaultValue: '',
    },
    ext: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },

    page: {
      type: DataTypes.STRING(256),
      defaultValue: '',
    },
    pvId: {
      type: DataTypes.STRING(64),
      defaultValue: '',
      field: 'pv_id',
    },

    dt: {
      type: DataTypes.STRING(128),
      defaultValue: '',
    },
    dr: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
    },
    de: {
      type: DataTypes.STRING(64),
      defaultValue: '',
    },
    dpr: {
      type: DataTypes.STRING(64),
      defaultValue: '',
    },
    lang: {
      type: DataTypes.STRING(64),
      defaultValue: '',
    },

    category: {
      type: DataTypes.STRING(32),
      defaultValue: '',
    },
    msg: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
    },
    stack: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    file: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    line: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    col: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    error: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },

    src: {
      type: DataTypes.STRING(1024),
      defaultValue: '',
    },
    nodeName: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'node_name',
    },
    xpath: {
      type: DataTypes.STRING(512),
      defaultValue: '',
    },
    resType: {
      type: DataTypes.STRING(32),
      defaultValue: '',
      field: 'res_type',
    },
    resName: {
      type: DataTypes.STRING(128),
      defaultValue: '',
      field: 'res_name',
    },
    domain: {
      type: DataTypes.STRING(128),
      defaultValue: '',
    },

    redirectTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'redirect_time',
    },
    appDns: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'app_dns',
    },
    dns: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tcp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ssl: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ttfb: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    trans: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dom: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    res: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    firstbyte: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fpt: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tti: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ready: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    load: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lcp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    api: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    success: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'Log',
    tableName: 'Log',
    timestamps: false
  }
)

export { Log }
