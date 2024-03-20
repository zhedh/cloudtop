import { LogData } from '../../types/log'
import { EventPool } from '../../utils/event_pool'
import { batchCreate } from './client'

export const createPool = new EventPool<LogData>(
  async (data) => {
    const res = await batchCreate(data).catch(error=> console.log(error))
    console.log('batchCreate:: ', res)
  },
  3000,
  50
)
