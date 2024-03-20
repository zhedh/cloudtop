export const toLine = (name: string) =>
  name.replace(/([A-Z])/g, '_$1').toLowerCase()

export const toHump = (name: string) =>
  name.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())

/**
 * 对象属性转下划线
 * @param obj
 * @returns
 */
export const dataKeyToLine = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => dataKeyToLine(i))
  }

  const result: Record<string, any> = {}
  for (let key in obj) {
    result[toLine(key)] = dataKeyToLine(obj[key])
  }

  return result
}

/**
 *
 * @param obj 对象属性转驼峰
 * @returns
 */
export const dataKeyToHump = (obj: any): any => {
  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((i) => dataKeyToHump(i))
  }

  const result: Record<string, any> = {}
  for (let key in obj) {
    result[toHump(key)] = obj[key]
  }

  return result
}
