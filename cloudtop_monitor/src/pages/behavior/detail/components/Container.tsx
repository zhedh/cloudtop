import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useCallback, useState } from 'react'

import Search, { SearchParams } from './Search'
import UserBehaviorList from './UserBehaviorList'
import { Behavior, BehaviorType } from '../../../../types/behavior'
import { queryBehaviorDetailList } from '../../../../services/behavior'

export const BehaviorDetail = () => {
  const { id } = useParams()
  const [query, setQuery] = useState<SearchParams>({} as SearchParams)
  const [type, setType] = useState<BehaviorType>()
  const [records, setRecords] = useState<Behavior[]>([])

  const getRecords = async (query: SearchParams, type?: BehaviorType) => {
    const { startTime, endTime } = query

    const { result } = await queryBehaviorDetailList({
      uid: id!,
      startTime: startTime?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime?.format('YYYY-MM-DD HH:mm:ss'),
      type,
    })

    setRecords(result)
    setQuery(query)
    setType(type)
  }

  const handleSearch = useCallback(async (values: SearchParams) => {
    getRecords(values)
  }, [])

  const handleChangeType = async (type?: BehaviorType) => {
    getRecords(query, type)
  }

  return (
    <Wrapper>
      <Search onSearch={handleSearch} />
      <UserBehaviorList
        records={records}
        type={type}
        onChangeType={handleChangeType}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: var(--padding);
`

export default BehaviorDetail
