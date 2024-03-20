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

// client
//   .search({ index: elasticConfig.INDEX, size: 20, type: elasticConfig.TYPE })
//   .then((res) => console.log('data: ', res.body.hits.hits[0]))
//   .catch((error) => console.log('error: ',error))

export const batchCreate = (records: Record<string, any>[]) => {
  const body: any[] = []
  const indexConfig = { _index: elasticConfig.INDEX, _type: elasticConfig.TYPE }

  records.forEach((record) => {
    body.push({ index: indexConfig })
    body.push(record)
  })

  return client.bulk({ body })
}

export default client
