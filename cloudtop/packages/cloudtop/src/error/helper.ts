export const parseError = (error: Error | any) => {
  if (
    error instanceof SyntaxError ||
    error instanceof TypeError ||
    error instanceof ReferenceError ||
    error instanceof RangeError ||
    error instanceof URIError
  ) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      error: {
        ...error,
        name: error.name ?? '',
        message: error.message ?? '',
        stack: error.stack ?? '',
      },
    }
  }

  return {
    name: 'CustomError',
    message:
      error.message ??
      (typeof error === 'string' ? error : JSON.stringify(error)),
    stack: error?.stack ?? '',
    error,
  }
}
