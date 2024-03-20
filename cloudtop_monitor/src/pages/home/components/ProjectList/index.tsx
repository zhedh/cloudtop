import { useEffect, useState } from 'react'
import {
  QueryProjectParams,
  queryProjectList,
} from '../../../../services/project'
import ProjectList from './ProjectList'
import { Project } from '../../../../types/project'

interface Props {
  query?: QueryProjectParams
}

const AppListContainer: React.FC<Props> = (props) => {
  const [records, setRecords] = useState<Project[]>([])

  useEffect(() => {
    if (!props.query) return
    getRecords(props.query)
  }, [props.query])

  const getRecords = async (query: QueryProjectParams) => {
    const { result } = await queryProjectList(query)

    setRecords(result.records)
  }

  return <ProjectList records={records}></ProjectList>
}

export default AppListContainer
