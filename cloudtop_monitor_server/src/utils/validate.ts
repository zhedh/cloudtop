import dayjs from 'dayjs'

/**
 * 验证日期区间参数
 * @param startDate
 * @param endDate
 * @returns
 */
export const validateDateRange = (
  startDate: string | number,
  endDate: string | number
): string => {
  if (!startDate) {
    return 'startDate 参数不能为空！'
  }

  if (!endDate) {
    return 'endDate 参数不能为空！'
  }

  try {
    dayjs(startDate)
    dayjs(endDate)
  } catch (error) {
    return 'startDate 或 endDate 参数格式不正确！'
  }

  return ''
}

/**
 * 验证时间区间参数
 * @param startTime
 * @param endTime
 * @returns
 */
export const validateTimeRange = (
  startTime: string | number,
  endTime: string | number
): string => {
  if (!startTime) {
    return 'startTime 参数不能为空！'
  }

  if (!endTime) {
    return 'endTime 参数不能为空！'
  }

  try {
    dayjs(startTime)
    dayjs(endTime)
  } catch (error) {
    return 'startTime 或 endTime 参数格式不正确！'
  }

  return ''
}
