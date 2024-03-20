import styled from 'styled-components'
import Search, { SearchParams } from './Search'
import { useCallback, useState } from 'react'
import List from './List'
import { queryBehaviorList } from '../../../../services/behavior'
import { PaginationProps } from '../../../../types'
import { Behavior } from '../../../../types/behavior'

export const BehaviorList = () => {
  const [query, setQuery] = useState<SearchParams>({} as SearchParams)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [records, setRecords] = useState<Behavior[]>([])

  const getRecords = async (
    query: SearchParams,
    pagination: PaginationProps
  ) => {
    const { startTime, endTime, keyword } = query

    const { result } = await queryBehaviorList({
      startTime: startTime?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: endTime?.format('YYYY-MM-DD HH:mm:ss'),
      keyword,
      current: pagination.current,
      pageSize: pagination.pageSize,
    })
    const { total } = result.pagination

    setRecords(result.records)
    setTotal(total!)
    setQuery(query)
    setCurrent(pagination.current)
    setPageSize(pagination.pageSize)
  }

  const handleSearch = useCallback(async (values: SearchParams) => {
    getRecords(values, { current: 1, pageSize: 10 })
  }, [])

  const handlePaginationChange = (current: number, pageSize: number) => {
    getRecords(query, { current, pageSize })
  }

  return (
    <Wrapper>
      <Search onSearch={handleSearch} />
      <List
        records={records}
        pagination={{ current, pageSize, total }}
        onPaginationChange={handlePaginationChange}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  /* padding-top: var(--header-height); */
`

export default BehaviorList
