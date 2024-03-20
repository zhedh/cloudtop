import { OverviewFlowType } from '../types/dashboard'

export const OVERVIEW_FLOW_TYPES = [
  {
    label: '浏览量（PV）',
    value: OverviewFlowType.PV,
  },
  {
    label: '访客数（UV）',
    value: OverviewFlowType.UV,
  },
  {
    label: '新访客',
    value: OverviewFlowType.NEW_UV,
  },
  {
    label: 'IP数',
    value: OverviewFlowType.IP,
  },
  {
    label: '频次（人均）',
    value: OverviewFlowType.FREQUENCY,
  },
  {
    label: '跳出率',
    value: OverviewFlowType.BOUNCE,
  },
]

export const OVERVIEW_FLOW_TYPE_MAP = OVERVIEW_FLOW_TYPES.reduce(
  (map, { label, value }) => ((map[value] = label), map),
  {} as {
    [name in OverviewFlowType]: string
  }
)
