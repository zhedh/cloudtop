import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { generateUUID } from '@cloudtop/utils'

function Home() {
  useEffect(() => {
    const uuid = generateUUID()
    console.log('uuid: ', uuid)

    fetch(
      'https://cloudtop-monitor-server-staging.retailaim.com/dashboard/overview/flo?projectCode=cloudshop_admin&date=2023-11-01',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'zh-CN,zh;q=0.9',
          'sec-ch-ua':
            '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://cloudtop-monitor-staging.retailaim.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
      }
    ).then((res) => console.log(res.json()))

    // const xhr = new XMLHttpRequest();
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState === 4) {
    //     if (xhr.status === 200) {
    //       // success
    //     } else {
    //       // error
    //     }
    //   }
    // };
    // xhr.open("GET", "https://cloudtop-monitor-server-staging.retailaim.com/dashboard/overview/flow?projectCode=cloudshop_admin&date=2023-11-01");
    // xhr.send();

    // export const getClientIp = async () => {
    //   return new Promise((resolve, reject) => {
    //     const xhr = new XMLHttpRequest()
    //     xhr.open('get', 'https://api.ip.sb/geoip')
    //     xhr.send()
    //     xhr.onload = (event) => {
    //       const { status, response, readyState, responseText } =
    //         event.target as XMLHttpRequest

    //       if (status === 200 && readyState === 4) {
    //         resolve(JSON.stringify(response))
    //         return
    //       }
    //       reject(responseText)
    //     }

    //     xhr.onerror = (event) => {
    //       const { responseText } = event.target as XMLHttpRequest
    //       reject(responseText)
    //     }
    //   })
    //   // https://api.ip.sb/geoip
    // }
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
