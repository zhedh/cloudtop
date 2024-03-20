import Search from './Search'
import ProjectListContainer from './ProjectList'
import { useCallback, useState } from 'react'
import { QueryProjectParams } from '../../../services/project'
import styled from 'styled-components'

const Home: React.FC = () => {
  const [query, setQuery] = useState<QueryProjectParams>()

  const handleSearch = useCallback(
    (values: QueryProjectParams) => setQuery(values),
    []
  )

  return (
    <Wrapper>
      <Search onSearch={handleSearch} />
      <ProjectListContainer query={query} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding-top: var(--header-height);
`

export default Home
