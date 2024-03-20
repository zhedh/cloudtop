import { ErrorData, LogCallback, LogType } from '../types'
import { parseError } from './helper'

const transform = (data: PromiseRejectionEvent) => {
  const { message, error } = parseError(data.reason)

  return {
    type: LogType.ERROR,
    category: 'PromiseRejection',
    msg: message,
    error: error,
  } as ErrorData
}

const handlePromiseError = (
  e: PromiseRejectionEvent,
  callback: LogCallback
) => {
  const data = transform(e)
  callback(data)
}

export const listenPromiseError = (callback: LogCallback) =>
  window.addEventListener(
    'unhandledrejection',
    (e) => (e.preventDefault(), handlePromiseError(e, callback)),
    true
  )
