import { LogCallback, LogType, PvData } from '../types'

const transform = () => {
  const pvData: PvData = {
    type: LogType.PV,
    // pvId: string
    dt: document.title,
    dr: document.referrer,
    de: document.characterSet,
    dpr: String(window.devicePixelRatio),
    lang: document.documentElement.lang,
    url: window.location.href, // 页面链接
  }

  return pvData
}

export const handlePV = (callback: LogCallback) => {
  const data = transform()
  callback(data)
}
