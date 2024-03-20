export class ApiData {
  code: number
  msg: string
  result: Record<string, any>

  constructor(code: number, msg: string, result?: Record<string, any>) {
    this.code = code
    this.msg = msg
    this.result = result || {}
  }
}

export class ApiError extends Error {
  code: number
  msg: string
  error: Record<string, any>

  constructor(code: number, message: string, error?: Record<string, any>) {
    super(`${message}（${code}）`)

    this.code = code
    this.msg = message
    this.error = error || {}
  }

  valueOf() {
    return {
      code: this.code,
      msg: this.msg,
      error: this.error,
    }
  }
}

