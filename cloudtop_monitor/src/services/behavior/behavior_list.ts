import { ApiListData, PaginationParams } from '../../types'
import { Behavior } from '../../types/behavior'
import { httpCatch } from '../../utils/http'

export interface QueryBehaviorParams extends PaginationParams {
  startTime: string // YYYY-MM-DD HH:mm:ss
  endTime: string // YYYY-MM-DD HH:mm:ss
  keyword?: string
}

export const queryBehaviorList = (
  params: QueryBehaviorParams
): ApiListData<Behavior> => httpCatch.get('/behavior/list', { params })
