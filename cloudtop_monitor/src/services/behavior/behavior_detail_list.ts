import { ApiResponse, StatParams } from '../../types'
import { Behavior, BehaviorType } from '../../types/behavior'
import { httpCatch } from '../../utils/http'

export interface QueryBehaviorDetailParams extends StatParams {
  uid: string
  type?: BehaviorType
}

/**
 * 获取用户行为明细列表
 * @param params
 * @returns
 */
export const queryBehaviorDetailList = (
  params: QueryBehaviorDetailParams
): ApiResponse<Behavior[]> => httpCatch.get('/behavior/detail/list', { params })
