import { LogType, PerfData, LogCallback } from '../types'

const getPerf = () => {
  const [timing] = window.performance.getEntries() as [
    PerformanceNavigationTiming
  ]

  const perfData: PerfData = {
    type: LogType.PERF,
    /**
     * 阶段性指标
     */
    dns: timing.domainLookupEnd - timing.domainLookupStart,
    tcp: timing.connectEnd - timing.connectStart,
    ssl: timing.connectEnd - timing.secureConnectionStart, // SSL连接耗时
    ttfb: timing.responseStart - timing.requestStart, // 网络请求耗时。等待接收响应的第一个字节所花费的时间
    trans: timing.responseEnd - timing.responseStart, // 数据传输耗时
    dom: timing.domInteractive - timing.redirectEnd, // DOM解析耗时
    res: timing.loadEventEnd - timing.domContentLoadedEventEnd, // 资源加载耗时（load事件耗时）
    /**
     * 关键性指标
     */
    firstbyte: timing.responseStart - timing.domainLookupStart, // First Byte时间
    fpt: timing.responseEnd - timing.fetchStart, // 首次渲染时间（白屏时间）
    tti: timing.domInteractive - timing.fetchStart, // 首次可操作时间
    // fcp: timing.firstContentTime - timing.fetchStart, // 首次可操作时间
    ready: timing.domContentLoadedEventEnd - timing.fetchStart, // HTML加载完成时间，即DOM Ready时间
    load: timing.loadEventEnd - timing.fetchStart, // 从开始加载到完全加载时间
    lcp: 0, // 最大内容绘制时间
  }

  return perfData
}

const getLcp = () =>
  new Promise((resolve) => {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = (entries[entries.length - 1] || {}) as Record<string,any>
      resolve(lastEntry.renderTime || lastEntry.loadTime)
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  })

export const reportPerf = (callback: LogCallback) => {
  window.addEventListener(
    'load',
    (e) => {
      getLcp().then((lcp: number) => {
        const data = getPerf()
        callback({ ...data, lcp })
      })
    },
    true
  )
}
