import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { generateUUID } from '@cloudtop/utils'

function Home() {
  useEffect(() => {
    const uuid = generateUUID()
    console.log('uuid: ', uuid)

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

    // window.fetch(
    //   'https://cloudtop-monitor-server-staging.retailaim.com/dashboard/overview/flow?startTime=2024-11-14+00:00:00&endTime=2024-11-14+23:59:59',
    //   {
    //     headers: {
    //       accept: 'application/json, text/plain, */*',
    //       'accept-language': 'zh-CN,zh;q=0.9',
    //       priority: 'u=1, i',
    //       'project-code': 'cloudshop_admin',
    //       'project-env': 'production',
    //       'sec-ch-ua':
    //         '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    //       'sec-ch-ua-mobile': '?0',
    //       'sec-ch-ua-platform': '"macOS"',
    //       'sec-fetch-dest': 'empty',
    //       'sec-fetch-mode': 'cors',
    //       'sec-fetch-site': 'same-site',
    //     },
    //     referrer: 'https://cloudtop-monitor-staging.retailaim.com/',
    //     referrerPolicy: 'strict-origin-when-cross-origin',
    //     body: null,
    //     method: 'GET',
    //     mode: 'cors',
    //     credentials: 'omit',
    //   }
    // )

    

  
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
