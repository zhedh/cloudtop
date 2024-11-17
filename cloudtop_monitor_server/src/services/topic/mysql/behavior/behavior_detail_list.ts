import { Op } from "sequelize"
import { search } from "../../../../database/elastic"
import { Log } from "../../../../schemas"
import { StatParams } from "../../../../types"
import { LogType } from "../../../../types/log"
import { ElasticBoolMust } from "../../../../utils/elastic_bool"
import { ApiData } from "../../../../utils/response"

interface BehaviorDetailQueryData extends StatParams {
  uid: string
  type: LogType
}

const getLogs = async (data: BehaviorDetailQueryData) => {

  const records = await Log.findAll({
    where: {
      pid: data.projectCode,
      env: data.projectEnv,
      type: data.type ?? false,
      uid: data.uid,
      reportTime: {
        [Op.between]: [+data.startTime, +data.endTime]
      },
    },
   
    limit: 10000,
    order: [
      ['reportTime', 'DESC']
    ],
  })

  return records


  // const must = new ElasticBoolMust()
  //   .addMatch('pid', data.projectCode)
  //   .addMatch('env', data.projectEnv)
  //   .addMatch('type', data.type)
  //   .addMatch('uid', data.uid)
  //   .addRange('date', {
  //     gte: +data.startTime,
  //     lte: +data.endTime,
  //   })

  // const query = {
  //   bool: {
  //     must: must.values(),
  //   },
  // }

  // const sort = [
  //   {
  //     date: {
  //       order: 'asc',
  //     },
  //   },
  // ]

  // return search({ query, sort }, 10000, 0)
}

/**
 * 用户行为明细列表，最多返回10000条数据
 * @param data
 * @returns
 */
export const behaviorDetailList = async (data: BehaviorDetailQueryData) => {
  const records  = await getLogs(data)

  return new ApiData(0, '查询项目列表成功', records)
}
