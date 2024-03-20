import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import styled from 'styled-components'
import { PROJECT_ENVS } from '../../../constants/project'
import { ProjectContext } from '../../../store'

const EnvFilter: React.FC = () => {
  const navigate = useNavigate()
  const [project, dispatch] = useContext(ProjectContext)

  const handleChangeEnv = (value: string) => {
    dispatch({ ...project, projectEnv: value })
    navigate(0)
  }

  return (
    <Wrapper>
      <label>环境：</label>
      <Select
        variant="borderless"
        options={PROJECT_ENVS}
        placeholder="请选择环境"
        allowClear
        value={project.projectEnv}
        onChange={handleChangeEnv}
      />
    </Wrapper>
  )
}

const Wrapper = styled.aside`
  margin-inline-start: 16px;
  margin-inline-end: 0;
  padding-left: 10px;
  background-color: var(--light-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);

  > label {
    color: var(--text-tertiary-color);
  }
`

export default EnvFilter
