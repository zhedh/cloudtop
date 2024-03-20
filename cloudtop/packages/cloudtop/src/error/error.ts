import { LogCallback, ErrorData, LogType, ResourceErrorData } from '../types'
import { parseError } from './helper'

interface ResourceTarget {
  src?: string
  href?: string
  localName?: string
  nodeName?: string
}

const getXpath = (target: HTMLElement) => {
  const list = [target.localName]

  while (target.parentElement) {
    target = target.parentElement
    list.unshift(target.localName)
  }

  return list.join('.')
}

const transform = (data: Event) => {
  // 资源加载错误
  const { localName, src, href, nodeName } =
    (data.target as ResourceTarget) || {}

  if (localName) {
    // 当 img 标签为空时候，也会监听报错，所以排除掉。
    if (window.location.href.indexOf(src || href) === 0) {
      return
    }

    const reg =
      /https?:\/\/([0-9a-zA-Z]{0,62}(\.[0-9a-zA-Z]{0,62})+)(\/.*)(\?|\#)?/
    const [_, domain, __, resName] = reg.exec(src || href)
    const resourceData: ResourceErrorData = {
      src: src || href,
      nodeName,
      xpath: getXpath(data.target as HTMLElement),
      resType: localName,
      resName,
      domain,
      type: LogType.RESOURCE_ERROR,
    }

    return resourceData
  }

  // 代码错误
  const { message, lineno, colno, filename, error } = data as ErrorEvent
  const { name, stack, error: newError } = parseError(error)
  return {
    type: LogType.ERROR,
    category: name,
    msg: message,
    stack: stack,
    file: filename,
    line: lineno,
    col: colno,
    error: JSON.stringify(newError),
  } as ErrorData
}

const handleError = (e: Event, callback: LogCallback) => {
  const data = transform(e)
  callback(data)
}

export const listenError = (callback: LogCallback) =>
  window.addEventListener(
    'error',
    (e) => (e.preventDefault(), handleError(e, callback)),
    true
  )
