import { Log } from '../../../schemas'

export const batchCreate = (records: Record<string, any>[]) => {
  console.log('records:: ', records)
  return Log.bulkCreate(records)
}