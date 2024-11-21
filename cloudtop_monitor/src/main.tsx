// import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import App from './App.tsx'
import './index.css'

dayjs.locale('zh-cn')

const theme = {
  token: {
    colorPrimary: '#8bbb11',
    colorLink: '#8bbb11',
    borderRadius: 4,
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ConfigProvider locale={zhCN} theme={theme}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
