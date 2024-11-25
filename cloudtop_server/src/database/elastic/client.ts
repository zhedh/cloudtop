import { Client } from '@elastic/elasticsearch'
import elasticConfig from '../../config/elastic'

const client = new Client({
  node: elasticConfig.NODE,
  auth: elasticConfig.AUTH,
})

export const createIndex = async () => {
  const { body: exist } = await client.indices.exists({
    index: elasticConfig.INDEX,
  })

  if (exist) return

  await client.indices.create({
    index: elasticConfig.INDEX,
    body: {
      mappings: {
        [elasticConfig.TYPE]: {
          properties: {
            date: { type: 'date' },
            report_time: { type: 'date' },
          },
        },
      },
    },
  })
}

export const deleteIndex = () =>
  client.indices.delete({ index: elasticConfig.INDEX })

export default client