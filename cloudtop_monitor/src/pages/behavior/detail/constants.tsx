import {
  ExclamationCircleOutlined,
  FileExclamationOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { BehaviorType } from '../../../types/behavior'

export const BEHAVIOR_TYPES = [
  {
    label: '浏览',
    value: BehaviorType.PV,
    icon: <ReadOutlined color="var(--primary--color)" />,
  },
  {
    label: '错误',
    value: BehaviorType.ERROR,
    icon: <ExclamationCircleOutlined color="var(--error--color)" />,
  },
  {
    label: '资源错误',
    value: BehaviorType.RESOURCE_ERROR,
    icon: <FileExclamationOutlined color="var(--error--color)" />,
  },
  // TODO 接口接入
  {
    label: '接口',
    value: BehaviorType.API,
    icon: <FileExclamationOutlined color="var(--error--color)" />,
  },
]

export const BEHAVIOR_TYPE_MAP = BEHAVIOR_TYPES.reduce(
  (map, cur) => ((map[cur.value] = cur), map),
  {} as {
    [name in BehaviorType]: (typeof BEHAVIOR_TYPES)[0]
  }
)
