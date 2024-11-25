import elasticConfig from '../../../config/elastic'
import client from '../../../database/elastic/client'
import { dataKeyToLine } from '../../../utils/format';

export const batchCreate = (records: Record<string, any>[]) => {
  const body: any[] = []
  const indexConfig = { _index: elasticConfig.INDEX, _type: elasticConfig.TYPE }

  records.forEach((record) => {
    body.push({ index: indexConfig })
    body.push(dataKeyToLine(record))
  })

  return client.bulk({ body })
}