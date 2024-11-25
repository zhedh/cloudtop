import { LogstoreType } from '../../types/base'

import * as elasticData from './elastic'
import * as mysqlData from './mysql'

export type * from './elastic'

const Topic = process.env.CLOUDTOP_LOGSTORE_TYPE === LogstoreType.ELASTIC ? elasticData : mysqlData

export default Topic