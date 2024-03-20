import { LogType, LogCallback, ApiLogData } from '../types'
import { apiEvent } from './helper'
import './fetch'
import './xhr'

const getDuration = (name: string): number => {
  const list = window.performance.getEntriesByName(name)
  const entry = list[list.length - 1]
  return entry?.duration
}

export const reportApi = (callback: LogCallback, baseURL: string) => {
  apiEvent.addListener(async (data: ApiLogData) => {
    const { api } = data
    const time = getDuration(api)

    /**
     * 监控请求不上报
     */
    if (api.includes(baseURL)) return

    callback({
      type: LogType.API,
      ...data,
      time: time,
    })
  })
}
