type CallbackHandler<T> = (value: T[]) => Promise<void>

export class EventPool<T = any> {
  timer: NodeJS.Timeout | undefined
  queue: T[]
  size: number
  timeout: number
  callback: CallbackHandler<T>

  constructor(callback: CallbackHandler<T>, timeout = 1000, size = 50) {
    this.queue = []
    this.size = size
    this.timeout = timeout
    this.callback = callback
  }

  push(data: T) {
    this.queue.push(data)

    if (this.queue.length >= this.size) {
      clearTimeout(this.timer)
      this.handler()
      return
    }

    if (this.queue.length > 1) return
    this.timer = setTimeout(() => this.handler(), this.timeout)
  }

  handler() {
    this.callback([...this.queue])
    this.queue = []
  }
}
