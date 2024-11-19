
const getArrayItemKey = <T extends Record<string, any> = any>(item: T, field: string | string[]) => {
  if (!Array.isArray(field)) return JSON.stringify(item[field])
  return JSON.stringify(field.map(key => item[key]))
}

/**
 * 数组2中的对象合并到数组1
 * @param arr1 数组1
 * @param arr2 数组2
 * @param field 匹配字段
 * @returns 
 */
export const arrayMergeByField = <T extends Record<string, any> = any>(arr1: T[], arr2: T[], field: string | string[]) => {
  const map = new Map()

  arr2.forEach(i => {
    const key = getArrayItemKey(i, field)
    if (map.get(key)) return
    map.set(key, i)
  })

  return arr1.map(i => {
    const key = getArrayItemKey(i, field)
    const others = map.get(key) || {}
    return {
      ...i,
      ...others
    }
  })
}

/**
 * 数组2根据属性归类到数组1中
 * @param arr1 
 * @param arr2 
 * @param field 
 * @param key 
 * @returns 
 */
export const arrayClassifyByField = <T extends Record<string, any> = any>(arr1: T[], arr2: T[], field: string | string[], prop = 'records') => {
  const map = new Map()

  arr2.forEach(i => {
    const key = getArrayItemKey(i, field)
    if (map.get(key)) {
      map.set(key, [...map.get(key), i])
      return
    }
    map.set(key, [i])
  })

  return arr1.map(i => {
    const key = getArrayItemKey(i, field)
    return {
      ...i,
      [prop]: map.get(key) || []
    }
  })
}

/**
 * 根据间隔生成数组
 * @param min 
 * @param max 
 * @param interval 
 * @returns 
 */
export const arrayGenerateOnInterval = (min: number, max: number, interval: number) => {
  const diff = max - min
  const length = Math.ceil(diff / interval)

  return Array.from({ length }).map((_, index) => min + index * interval)
}