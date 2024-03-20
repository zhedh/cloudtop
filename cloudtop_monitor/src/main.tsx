// import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'

// const xhrSend = XMLHttpRequest.prototype.send

// XMLHttpRequest.prototype.send = function (body) {
//   console.log('body:: ', body)
//   this.addEventListener('load', (e) => {
//     console.log('XMLHttpRequest: ', e)
//     const target = e.target as XMLHttpRequest

//     const path = target.responseURL?.split('?')[0]
//     const reg = /https?:\/\/.+\/.*\.([^/.]+)$/

//     console.log('path::: ', path)
//     console.log(reg.test(path))
//     console.log(reg.test('http://www.baidu.com'))
//   })
//   xhrSend.call(this, body)
// }

// const _fetch = window.fetch

// window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
//   return _fetch(input, init).then(
//     (res) => {
//       console.log('window.fetch: ', res)
//       // handle(res)
//       return res
//     },
//     (res) => {
//       // handle(res)
//       return Promise.reject(res)
//     }
//   )
// }

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
