export function listToMap<T = any>(
  list: any[],
  key: string
): Record<string, T> {
  return list.reduce((result: Record<string, T>, item) => {
    result[item[key]] = item
    return result
  }, {})
}
