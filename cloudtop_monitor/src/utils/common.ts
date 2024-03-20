/**
 * 防抖函数
 * @param fn 执行函数
 * @param delay 延迟时间
 * @returns
 */
export function debounce(fn: (...args: any[]) => void, delay = 200) {
  let timer: number

  return (...args: any[]) => {
    clearTimeout(timer)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
