import { Dayjs } from 'dayjs'
import { search } from './client'
import { LogType } from '../../types/log'

export const searchLog = async (projectCode: string, dateRange: Dayjs[]) => {
  const [startDate, endDate] = dateRange

  const query = {
    bool: {
      must: [
        {
          match: { pid: projectCode },
        },
        {
          range: {
            date: {
              gte: +startDate,
              lte: +endDate,
            },
          },
        },
      ],
    },
  }

  const sort = [
    {
      date: {
        order: 'desc',
      },
    },
  ]

  return search({ query, sort })
}

export const searchPvLog = async (projectCode: string, dateRange: Dayjs[]) => {
  const [startDate, endDate] = dateRange

  const query = {
    bool: {
      must: [
        {
          match: { pid: projectCode },
        },
        {
          match: { type: LogType.PV },
        },
        {
          range: {
            date: {
              gte: +startDate,
              lte: +endDate,
            },
          },
        },
      ],
    },
  }

  const sort = [
    {
      date: {
        order: 'desc',
      },
    },
  ]

  return search({ query, sort })
}
