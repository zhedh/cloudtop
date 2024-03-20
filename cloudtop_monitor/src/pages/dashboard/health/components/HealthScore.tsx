import styled from 'styled-components'
import ProgressView from '../../../../components/ProgressView'
import { HealthScoreData } from '../../../../services/dashboard'
import { SCORE_RECORD_TYPE_MAP } from '../constant'

interface Props {
  scoreData: HealthScoreData
}
const HealthScore = ({ scoreData: data }: Props) => {
  const calculateGradeColor = (ratio: number = 0) => {
    if (ratio <= 5 / 100) {
      return '#52c41a'
    }
    if (ratio <= 20 / 100) {
      return '#faad14'
    }

    return '#ff4d4f'
  }

  return (
    <Wrapper>
      <main>
        <ProgressView
          radius={75}
          radio={data.score / 100}
          color={calculateGradeColor(1 - data.score / 100)}
        >
          <ScoreBox>
            <span style={{ color: calculateGradeColor(1 - data.score / 100) }}>
              {data.score?.toFixed(0)}
            </span>
            <label>健康状态</label>
          </ScoreBox>
        </ProgressView>
      </main>
      <ul>
        {data.records.map((i) => (
          <li key={i.type}>
            <ProgressView
              radius={50}
              radio={i.ratio}
              color={calculateGradeColor(i.ratio)}
            >
              <span>
                {(i.ratio * 100).toFixed(2)}
                <small>%</small>
              </span>
            </ProgressView>
            <label>{SCORE_RECORD_TYPE_MAP[i.type].label}</label>
          </li>
        ))}
      </ul>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  display: flex;
  margin: 0 var(--margin) var(--margin);
  padding: var(--padding);
  border-radius: var(--border-radius);
  background-color: var(--light-color);

  > main {
    position: relative;
    display: flex;
    justify-content: center;
    width: 30%;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      width: 2px;
      height: 140px;
      background-color: var(--background-color);
    }
  }

  ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 0;
    width: 70%;
    list-style: none;

    li {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    li label {
      margin-top: 10px;
      color: var(--text-tertiary-color);
    }

    li span {
      font-size: 24px;
      color: var(--text-secondary-color);

      small {
        font-size: 1rem;
      }
    }
  }
`

const ScoreBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: 48px;
    color: var(--primary-color);
  }

  label {
    color: var(--text-secondary-color);
  }
`

export default HealthScore
