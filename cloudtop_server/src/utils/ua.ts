import UAParser from 'ua-parser-js'

export const isMobile = (ua: string) =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

export const uaParser = (ua: string) => {
  const parser = new UAParser(ua)
  const { browser, engine, os, device } = parser.getResult()

  return {
    browser: browser?.name ?? '',
    browserVersion: browser?.version ?? '',
    device: device?.model ?? '',
    engine: engine?.name ?? '',
    engineVersion: engine?.version ?? '',
    os: os?.name ?? '',
    osVersion: os?.version ?? '',
    deviceType: isMobile(ua) ? 'mobile' : 'pc',
  }
}
