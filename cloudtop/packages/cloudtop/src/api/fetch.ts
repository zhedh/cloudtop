import { apiEvent, apiIntercept } from './helper'

const _fetch = window.fetch

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  const startTime = performance.now()
  return _fetch(input, init).then(
    (res) => {
      const endTime = performance.now()
      handle(res, endTime - startTime)
      return res
    },
    (res) => {
      const endTime = performance.now()
      handle(res, endTime - startTime)
      return Promise.reject(res)
    }
  )
}

const handle = (res: Response, time: number) => {
  try {
    if (apiIntercept(res.status, res.url)) {
      return
    }

    apiEvent.dispatch({
      api: res.url?.split('?')[0],
      success: res.ok ? 1 : 0,
      status: res.status,
      msg: res.statusText,
      time,
    })
  } catch (error) {
    console.log(error)
  }
}
