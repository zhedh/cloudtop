import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { generateUUID } from '@cloudtop/utils'

function Home() {
  useEffect(() => {
    const uuid = generateUUID()
    console.log('uuid: ', uuid)

    const http2 = () => {
      // WARNING: For POST requests, body is set to null by browsers.
      const data = JSON.stringify({
        goodsName: '辛巴克',
        goodsPrice: '2000',
        screenshot: [
          'https://netresource.oss-cn-shanghai.aliyuncs.com/business/cloudshop-system/0acc01083af30ea0761fbc800_222.jpeg',
        ],
      })

      const xhr = new XMLHttpRequest()
      xhr.withCredentials = true

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          console.log(this.responseText)
        }
      })

      xhr.open(
        'POST',
        'https://cloudshop-system-server-testing.retailaim.com//tongs/goods/create'
      )
      xhr.setRequestHeader('Api-Key', '0f9dbeb8-1fd9-4f0e-8b52-03edfb7669c1')
      xhr.setRequestHeader('Content-Type', 'application/json')

      xhr.send(data)
    }

    http2()

    setTimeout(()=> {
      http2()
    }, 10)

    const http1 = () => {
      const myHeaders = new Headers()
      myHeaders.append('Api-Key', '0f9dbeb8-1fd9-4f0e-8b52-03edfb7669c1')
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        goodsName: '辛巴克',
        goodsPrice: '2000',
        screenshot: [
          'https://netresource.oss-cn-shanghai.aliyuncs.com/business/cloudshop-system/0acc01083af30ea0761fbc800_222.jpeg',
        ],
      })

      fetch(
        'https://cloudshop-system-server-testing.retailaim.com/tongs/goods/create',
        {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        }
      )
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error))
    }

    http1()

    window.fetch(
      'https://cloudshop-server-dev.retailaim.com/wx-corp/customer-service/messages/999999',
      {
        headers: {
          accept: '*/*',
          // 'accept-language': 'zh-CN,zh;q=0.9',
          'agent-app-id': '24',
          'content-type': 'application/json',
          // priority: 'u=1, i',
          // 'sec-ch-ua':
          //   '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
          // 'sec-ch-ua-mobile': '?0',
          // 'sec-ch-ua-platform': '"macOS"',
          // 'sec-fetch-dest': 'empty',
          // 'sec-fetch-mode': 'cors',
          // 'sec-fetch-site': 'same-site',
        },
        // referrer: 'https://cloudshop-system-testing.retailaim.com/',
        // referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        // mode: 'cors',
        // credentials: 'omit',
      }
    )
  
  }, [])

  return (
    <article>
      <h1>Hello World</h1>
      <Link to="/about">About Us</Link>
      <br />
      <Link to="/contact">Contact Us</Link>
    </article>
  )
}

export default Home
