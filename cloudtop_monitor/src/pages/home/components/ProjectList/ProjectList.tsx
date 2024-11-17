import styled from 'styled-components'
import ProjectCard from './ProjectCard'
import { Project, ProjectEnv } from '../../../../types/project'

interface Props {
  projectEnv: ProjectEnv
  records: Project[]
}

const ProjectList: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <section>
        {props.records.map((record) => (
          <ProjectCard
            key={record.id}
            record={record}
            projectEnv={props.projectEnv}
          />
        ))}
      </section>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-sizing: border-box;
  margin: var(--margin);
  padding: 0;

  > section {
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: var(--margin);
    grid-column-gap: var(--margin);
  }
`

export default ProjectList
