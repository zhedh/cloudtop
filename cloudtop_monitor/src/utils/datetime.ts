import dayjs, { Dayjs } from 'dayjs'

/**
 * 日期转时间区间
 * @param date
 * @param format
 * @returns
 */
export const datetimeRangFromDate = <T = Dayjs>(
  date: string | number | Dayjs,
  format?: string
): T[] => {
  date = dayjs(date)
  const startTime = date.startOf('date')
  const endTime = date.endOf('date')

  if (format) {
    return [startTime.format(format), endTime.format(format)] as T[]
  }

  return [startTime, endTime] as T[]
}
