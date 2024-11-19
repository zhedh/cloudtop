import { apiEvent, apiIntercept } from './helper'

const xhrSend = XMLHttpRequest.prototype.send

XMLHttpRequest.prototype.send = function (body) {
  const startTime = performance.now()
  const callback = (event: Event) => {
    const endTime = performance.now()
    handle(event, endTime - startTime)

    this.removeEventListener('error', callback)
    this.removeEventListener('load', callback)
  }

  this.addEventListener('error', callback)
  this.addEventListener('load', callback)

  xhrSend.call(this, body)
}


const handle = (event: Event, time: number) => {
  try {
    const target = event.target as XMLHttpRequest
    const success = target.status >= 200 && target.status < 400

    if (apiIntercept(target.status, target.responseURL)) {
      return
    }

    apiEvent.dispatch({
      api: target.responseURL?.split('?')[0],
      success: success ? 1 : 0,
      status: target.status,
      msg: target.statusText || (!success ? target.responseText : ''),
      time,
    })
  } catch (error) {
    console.log(error)
  }
}
