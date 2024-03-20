import { apiEvent, apiIntercept } from './helper'

const xhrSend = XMLHttpRequest.prototype.send

XMLHttpRequest.prototype.send = function (body) {
  this.addEventListener('error', handle)
  this.addEventListener('load', handle)
  xhrSend.call(this, body)
}

const handle = (event: Event) => {
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
    })
  } catch (error) {
    console.log(error)
  }
}
