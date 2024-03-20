import { NotificationInstance } from 'antd/es/notification/interface'
import * as React from 'react'

interface Props {
  notification: NotificationInstance
}

export const NotificationContext = React.createContext({
  notification: undefined,
} as unknown as Props)
