import { apiEvent, apiIntercept } from './helper'

const _fetch = window.fetch

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  return _fetch(input, init).then(
    (res) => {
      handle(res)
      return res
    },
    (res) => {
      handle(res)
      return Promise.reject(res)
    }
  )
}

const handle = (res: Response) => {
  try {
    if (apiIntercept(res.status, res.url)) {
      return
    }

    apiEvent.dispatch({
      api: res.url?.split('?')[0],
      success: res.ok ? 1 : 0,
      status: res.status,
      msg: res.statusText,
    })
  } catch (error) {
    console.log(error)
  }
}
