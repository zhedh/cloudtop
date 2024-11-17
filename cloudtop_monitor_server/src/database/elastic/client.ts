import { Client } from '@elastic/elasticsearch'
import elasticConfig from '../../config/elastic'
import { dataKeyToHump } from '../../utils/format'

const client = new Client({
  node: elasticConfig.NODE,
  auth: elasticConfig.AUTH,
  // timezone: '+08:00',
})

export const createIndex = async () => {
  const { body: exist } = await client.indices.exists({
    index: elasticConfig.INDEX,
  })

  if (exist) {
    await client.indices.putMapping({
      index: elasticConfig.INDEX,
      type: elasticConfig.TYPE,
      body: {
        properties: {
          date: { type: 'date' },
          report_time: { type: 'date' },
          msg: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 512,
              },
            },
          },
        },
      },
    })
    return
  }

  await client.indices.create({
    index: elasticConfig.INDEX,
    body: {
      mappings: {
        [elasticConfig.TYPE]: {
          properties: {
            date: { type: 'date' },
            report_time: { type: 'date' },
            msg: {
              type: 'text',
              fields: {
                keyword: {
                  type: 'keyword',
                  ignore_above: 512,
                },
              },
            },
          },
        },
      },
    },
  })
}

export const deleteIndex = () =>
  client.indices.delete({ index: elasticConfig.INDEX })

export const batchCreate = (records: Record<string, any>[]) => {
  const body: any[] = []
  const indexConfig = { _index: elasticConfig.INDEX, _type: elasticConfig.TYPE }

  records.forEach((record) => {
    body.push({ index: indexConfig })
    body.push(record)
  })

  return client.bulk({ body })
}

export const search = async (
  body: Record<string, any>,
  size: number = 10000,
  from: number = 0
) => {
  // const data = await fetch(
  //   `https://cloudtop-monitor-server-staging.retailaim.com/elastic/search?size=${size}&from=${from}`,
  //   {
  //     method: 'post',
  //     body: JSON.stringify(body),
  //   }
  // ).then((res) => res.json())

  // return data

  return client
    .search({
      index: elasticConfig.INDEX,
      type: elasticConfig.TYPE,
      size: size,
      from: from,
      body: body,
    })
    .then((res) => {
      const { aggregations = {} } = res.body
      const { hits, total } = res.body.hits
      const records = hits.map((i: Record<string, any>) =>
        dataKeyToHump({ ...i._source, id: i._id })
      )

      // console.log(res.body)

      return { total, records, aggregations: aggregations }
    })
    .catch((error) => (console.log('error: ', error), error))
}

export const count = async (body: Record<string, any>) => {
  // const data = await fetch(
  //   'https://cloudtop-monitor-server-staging.retailaim.com/elastic/count',
  //   {
  //     method: 'post',
  //     body: JSON.stringify(body),
  //   }
  // ).then((res) => res.json())

  // return data

  return client
    .search({
      index: elasticConfig.INDEX,
      type: elasticConfig.TYPE,
      size: 0,
      body: body,
    })
    .then((res) => {
      const { aggregations } = res.body
      const { total } = res.body.hits

      return { ...aggregations, total }
    })
    .catch((error) => (console.log('error: ', error), error))
}

export default client
