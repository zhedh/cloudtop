import { Button, Card, Empty } from 'antd'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { Behavior, BehaviorType } from '../../../../types/behavior'
import { BEHAVIOR_TYPES, BEHAVIOR_TYPE_MAP } from '../constants'

interface Props {
  records: Behavior[]
  type?: BehaviorType
  onChangeType: (type?: BehaviorType) => void
}

const UserBehaviorList: React.FC<Props> = (props) => {
  const renderItem = (record: Behavior) => {
    const behaviorType = BEHAVIOR_TYPE_MAP[record.type] || {}

    return (
      <li key={record.id}>
        <aside>{behaviorType.icon}</aside>
        <RecordPreview>
          <h4>
            <span>{behaviorType.label}</span>
            <small>{dayjs(record.reportTime).format('HH:mm:ss')}</small>
          </h4>
          <p>
            {/* TODO 临时 */}
            {behaviorType.value === BehaviorType.API ? record.api : record.url}
          </p>
        </RecordPreview>
      </li>
    )
  }

  return (
    <Wrapper
      title={
        <Title>
          用户行为列表
          <aside>
            <Button
              type={!props.type ? 'primary' : 'default'}
              onClick={() => props.onChangeType()}
            >
              全部
            </Button>
            {BEHAVIOR_TYPES.map((behaviorType) => (
              <Button
                key={behaviorType.value}
                type={props.type === behaviorType.value ? 'primary' : 'default'}
                onClick={() => props.onChangeType(behaviorType.value)}
              >
                {behaviorType.label}
              </Button>
            ))}
          </aside>
        </Title>
      }
      bordered={false}
    >
      <Content>
        <BehaviorRecords>
          {props.records.length ? (
            props.records.map((record) => renderItem(record))
          ) : (
            <Empty />
          )}
        </BehaviorRecords>
        <aside></aside>
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  .ant-card-head {
    padding: 0 var(--padding);
  }

  .ant-card-body {
    padding: var(--padding);
  }
`

const Title = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  aside button {
    margin-right: 0;
    margin-left: 10px;
  }
`

const Content = styled.div`
  display: flex;
`

const BehaviorRecords = styled.ul`
  flex: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 600px;
  overflow-y: auto;

  > li {
    position: relative;
    padding-left: 40px;
    padding-bottom: var(--padding);

    > aside {
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 100%;
      box-sizing: border-box;
      padding-top: 10px;

      &::after {
        content: '';
        position: absolute;
        left: 11px;
        top: 44px;
        bottom: 0;
        width: 2px;
        display: block;
        background-color: var(--background-color);
      }

      svg {
        font-size: 24px;
        color: var(--primary-color);
      }
    }

    &:last-child {
      padding-bottom: 0;
    }

    &:last-child > aside::after {
      display: none;
    }
  }
`

const RecordPreview = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background-color: var(--background-color);

  h4 {
    display: flex;
    justify-content: space-between;
    margin: 0;
    font-size: 14px;

    small {
      font-weight: normal;
      font-size: 12px;
      color: var(--text-secondary-color);
    }
  }

  p {
    margin: 0;
    margin-top: 8px;
    /* width: 500px; */
    color: var(--text-secondary-color);
    word-break: break-all;
  }
`

export default UserBehaviorList
