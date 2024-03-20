# Cloudtop 前端性能监控探针

一款轻量级的收集前端页面性能、页面报错、接口性能、接口错误以及用户行为并上报服务端的 SDK。

## 功能

- 页面性能上报
- 页面错误上报
- 接口性能上报
- 接口错误上报
- 资源加载异常上报
- 支持 web 端接入

## 接入指南

### Script 植入

1.复制探针代码（ dist 包中的 cloudtop.iife.js 或 cloudtop.umd.js），将生产环境探针代码插入到 head 标签的最顶部

```html
<head>
  <script>
    var Cloudtop=function()...
  </script>
</head>
```

2.探针初始化

| 字段       | 类型   | 必填 | 描述                  | 示例                  |
| :--------- | :----- | :--- | :-------------------- | :-------------------- |
| baseURL    | string | 必填 | 日志上报地址          | http://localhost:3000 |
| projectId  | string | 必填 | 项目标识（项目 CODE） | cloudtop_monitor      |
| env        | string | 必填 | 项目环境 ProjectEnv   | production            |
| reportType | string | 可选 | 上报方式 ReportType   | beacon                |

ProjectEnv 枚举

| 值          | 描述     |
| :---------- | :------- |
| production  | 生产环境 |
| staging     | 预发环境 |
| testing     | 测试环境 |
| development | 开发环境 |

ReportType 枚举，默认 beacon

| 值     | 描述                 |
| :----- | :------------------- |
| beacon | navigator.sendBeacon |
| img    | 图片上报             |
| xhr    | httpRequest          |

```js
window.cloudtop = new Cloudtop({
  baseURL: 'http://localhost:3000',
  projectId: 'cloudtop_monitor',
  env: 'production', // 上报环境
  reportType: 'beacon', // 上报方式
})
```

3.对于单页应用，路由变化需要调用 routeChange 方法，触发 PV 上报

```js
// pathname 推荐使用页面路径，可自定义
window.cloudtop.routeChange(pathname)
```

4.部分日志服务可能不支持获取客户端 ID，需要前端调用接口获取后上报

- 日志服务支持获取客户端 IP，可忽略
- 根据项目需要客户端 IP 可选上报

上报示例如下

```js
/**
 * 获取客户端IP，用于性能监控
 */
const getClientIp = async () => {
  const { status, data } = await axios.get('https://api.ip.sb/geoip')
  if (status === 200) {
    window.cloudtop.setConfig({ clientIp: data.ip })
  }
}
```

### NPM 接入

1.安装

```bash
npm install cloudtop --save
```

2.引入

```js
import Cloudtop from 'cloudtop'

const cloudtop = new Cloudtop({
  baseURL: 'http://localhost:3000',
  projectId: 'cloudtop-monitor',
  env: 'testing',
  reportType: 'beacon',
})
```

3.方法调用同 Script 植入

```js
cloudtop.routeChange(pathname)
```

```js
cloudtop.setConfig({ clientIp: data.ip })
```
