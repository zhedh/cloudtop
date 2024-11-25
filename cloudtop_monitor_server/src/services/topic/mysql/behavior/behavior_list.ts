import { PaginationParams, StatParams } from '../../../../types'
import { Log } from '../../../../schemas'
import { Op, Sequelize } from 'sequelize'
import { ApiData } from '../../../../utils/response'

interface BehaviorQueryData extends StatParams, PaginationParams {
  keyword: string
}

const getRawMap = async (rows: Log[], queryCondition = {}) => {
  // 构建子查询条件
  const subQuery = rows.map(i => ({
    uid: i.uid,
    reportTime: i.reportTime
  }));

  const raws = await Log.findAll({
    where: { [Op.or]: subQuery, ...queryCondition },
    order: [['reportTime', 'DESC']],
  })

  return raws.reduce((map, item) => {
    if (!map[item.uid]) {
      map[item.uid] = item
    }

    return map
  }, {} as Record<string, Log>)
}

const getLogs = async (data: BehaviorQueryData) => {
  const { pageSize = 20, current = 1 } = data
  const offset = (current - 1) * pageSize

  const queryCondition = {
    pid: data.projectCode,
    env: data.projectEnv,
    reportTime: {
      [Op.between]: [+data.startTime, +data.endTime]
    },
  }

  if (data.keyword) {
    const like = {
      [Op.or]: [
        { uid: { [Op.like]: `%${data.keyword}%` } },
        { loginId: { [Op.like]: `%${data.keyword}%` } }
      ] 
    }
    Object.assign(queryCondition, like)
  }

  const { rows, count } = await Log.findAndCountAll({
    where: queryCondition,
    attributes: [
      'uid',
      [Sequelize.fn('MAX', Sequelize.col('report_time')), 'reportTime']
    ],
    group: ['uid'], 
    limit: pageSize, 
    offset: offset, 
    order: [
      [Sequelize.literal('MAX("report_time")'), 'DESC']
    ],
    raw: true
  })

  const map = await getRawMap(rows, queryCondition)

  return {
    rows: rows.map(i => {
      const log = map[i.uid]
      return {
        ...i,
        id: log.id,
        pid: log.pid,
        type: log.type,
        loginId: log.loginId,
        url: log.url,
        page: log.page,
        api: log.api,
      }
    }),
    count,
  }
}

export const behaviorList = async (data: BehaviorQueryData) => {
  const { rows, count } = await getLogs(data)

  return new ApiData(0, '查询项目列表成功', {
    records: rows,
    pagination: {
      current: data.current,
      pageSize: data.pageSize,
      total: count,
    },
  })
}
