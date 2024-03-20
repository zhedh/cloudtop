import styled from 'styled-components'
import { SettingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Project, ProjectEnv } from '../../../../types/project'
import { ProjectContext } from '../../../../store/context_project'
import { useContext, useEffect, useState } from 'react'
import { ProjectStatData, queryProjectStat } from '../../../../services/project'
import dayjs from 'dayjs'
import { datetimeRangFromDate } from '../../../../utils/datetime'

interface Props {
  record: Project
}

const ProjectCard: React.FC<Props> = (props) => {
  const { record } = props
  const navigate = useNavigate()
  const [, dispatch] = useContext(ProjectContext)
  const [data, setData] = useState<ProjectStatData>({} as ProjectStatData)

  useEffect(() => {
    const [startTime, endTime] = datetimeRangFromDate(
      dayjs(),
      'YYYY-MM-DD HH:mm:ss'
    ) as string[]

    queryProjectStat({
      projectCode: record.projectCode,
      startTime,
      endTime,
    }).then((res) => (console.log('res: ', res), setData(res.result)))
  }, [])

  const handleToProject = () => {
    dispatch({
      ...props.record,
      projectEnv: ProjectEnv.PRODUCTION, // 默认选中生产环境
    })
    navigate('/monitor/dashboard')
  }

  return (
    <Wrapper onClick={handleToProject}>
      <Header>
        <span>{record.projectName}</span>
        <small>
          <Button type="link">查看明细</Button>
          <SettingOutlined />
        </small>
      </Header>
      <UserOverview>
        <li>
          <span>{data.uv}</span>
          <label>今日活跃用户</label>
        </li>
        <li>
          <span>{data.pv}</span>
          <label>今日浏览量</label>
        </li>
        <li>
          <span>{(data.error ?? 0) + (data.resourceError ?? 0)}</span>
          <label>今日错误数</label>
        </li>
        {/* <li>
          <span>--</span>
          <label>新增用户数</label>
        </li> */}
        {/* <li>
          <span>--</span>
          <label>总用户数</label>
        </li> */}
      </UserOverview>
      <HealthOverview>
        <HealthScore>{data.score?.toFixed(0)}</HealthScore>
        <ul>
          <li>
            <label>JS报错率：</label>
            <span>
              {((data.errorRatio ?? 0) * 100)?.toFixed(2)}
              <i>%</i>
            </span>
          </li>
          {/* <li>
            <label>Promise报错率：</label>
            <span>
              --<i>%</i>
            </span>
          </li> */}
          {/* <li>
            <label>接口报错率：</label>
            <span>
              --<i>%</i>
            </span>
          </li> */}
          <li>
            <label>静态资源报错率：</label>
            <span>
              {((data.resourceErrorRatio ?? 0) * 100).toFixed(2)}
              <i>%</i>
            </span>
          </li>
        </ul>
      </HealthOverview>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: var(--padding);
  background-color: var(--light-color);
  border-radius: var(--border-radius);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;

  > span {
    font-size: 16px;
  }

  > small {
    font-size: 12px;
  }
`

const UserOverview = styled.ul`
  display: flex;
  justify-content: space-between;

  margin: 0;
  padding: 0;
  margin-top: 10px;
  list-style: none;

  > li {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }

    span {
      font-size: 18px;
      font-weight: bold;
      font-family: DIN Alternate Bold;
    }

    &:first-child span {
      font-size: 28px;
      color: var(--primary-color);
    }

    label {
      color: var(--text-tertiary-color);
      font-size: 12px;
    }
  }
`

const HealthOverview = styled.div`
  display: flex;
  align-items: center;
  margin-top: var(--margin);

  > ul {
    display: grid;
    grid-template-columns: 1fr 1fr;

    margin: 0 0 0 15px;
    padding: 0;
    list-style: none;

    @media only screen and (max-width: 1240px) {
      grid-template-columns: 1fr;
    }

    > li {
      line-height: 2.2;

      label,
      i {
        color: var(--text-tertiary-color);
        font-size: 12px;
      }
    }
  }
`

const HealthScore = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border: 3px solid var(--primary-color);
  border-radius: 50%;

  font-size: 28px;
  color: var(--primary-color);
`

export default ProjectCard
