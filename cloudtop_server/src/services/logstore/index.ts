import { LogstoreType } from '../../types/base'
import { LogData } from '../../types/log'
import { EventPool } from '../../utils/event_pool'

import * as elasticStore from './elastic'
import * as mysqlStore from './mysql'

const logstore = process.env.CLOUDTOP_LOGSTORE_TYPE === LogstoreType.ELASTIC ? elasticStore : mysqlStore

export const logPool = new EventPool<LogData>(
  async (data) => {
    const logs = await logstore.batchCreate(data).catch(error => console.log(error))
    console.log('logs:: ', logs)
  },
  3000,
  50
)
