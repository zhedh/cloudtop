

/**
 * 按时间间隔进行分组
 * @param startTime 开始时间（毫秒）
 * @param endTime 结束时间（毫秒）
 * @param interval 时间间隔（毫秒）
 * @returns 
 */
export const datetimeGroup = (startTime: number, endTime: number, interval: number) => {
  const diff = endTime - startTime
  const length = Math.ceil(diff / interval)

  return Array.from({ length }).map((_, index) => startTime + index * interval)
}