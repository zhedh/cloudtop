# Cloudtop 前端性能监控系统

Cloudtop 前端监控系统是一套集流量监控、错误监控、性能监控、接口监控于一体的监控平台；目前支持 Web 端接入。

## 项目介绍

```txt
.
├── Dockerfile
├── README.md
├── cloudtop
├── cloudtop_monitor
├── cloudtop_monitor_server
├── cloudtop_server
├── init.sh
├── package.json
└── start.sh
```

cloudtop：前端性能监控探针
cloudtop_server：日志上报服务，接收处理探针上报的日志数据
cloudtop_monitor：前端性能监控数据大盘
cloudtop_monitor_server：前端性能监控数据检索服务

## 环境变量配置

| 变量                         | 描述                               | 必填 | 默认值   |
| :--------------------------- | :--------------------------------- | :--- | :------- |
| CLOUDTOP_ELASTIC_NODE        | Elastic 连接                       | 必填 | -        |
| CLOUDTOP_ELASTIC_USERNAME    | Elastic 账号                       | 必填 | -        |
| CLOUDTOP_ELASTIC_PASSWORD    | Elastic 密码                       | 必填 | -        |
| CLOUDTOP_ELASTIC_INDEX       | Elastic 索引                       | 必填 | -        |
| CLOUDTOP_ELASTIC_TYPE        | Elastic 类型                       | 必填 | -        |
| CLOUDTOP_DATABASE_HOST       | Mysql 主机                         | 必填 | -        |
| CLOUDTOP_DATABASE_PORT       | Mysql 端口号                       | 必填 | -        |
| CLOUDTOP_DATABASE_USER       | Mysql 账号                         | 必填 | -        |
| CLOUDTOP_DATABASE_PASSWORD   | Mysql 密码                         | 必填 | -        |
| CLOUDTOP_DATABASE_DATABASE   | Mysql 数据库名                     | 必填 | -        |
| VITE_PORT                    | cloudtop_monitor 应用端口号        | 可选 | 8000     |
| VITE_BASE_URL                | cloudtop_monitor 应用接口域名      | 必填 |          |
| VITE_SHA1_SALT               | cloudtop_monitor 应用 sha1 key     | 可选 | 代码指定 |
| CLOUDTOP_MONITOR_SERVER_PORT | cloudtop_monitor_server 应用端口号 | 可选 | 3100     |
| CLOUDTOP_SERVER_PORT         | cloudtop_server 应用端口号         | 可选 | 3000     |

## 本地开发

[cloudtop：前端性能监控探针](/cloudtop/README.md)

[cloudtop_server：日志上报服务](/cloudtop_server/README.md)

[cloudtop_monitor：前端性能监控数据大盘](/cloudtop_monitor/README.md)

[cloudtop_monitor_server：前端性能监控数据检索服务](/cloudtop_monitor_server/README.md)

## 项目部署

初始化项目

```bash
npm run init
```

启动项目

```bash
npm run start
```

查看日志

```bash
pm2 log
```

### Docker 部署

支持 Docker 部署，可根据需要修改 Dockerfile 文件。

- 项目端口号需要在 Dockerfile 中 EXPOSE

## 安装探针

参考 [探针安装说明](/cloudtop/packages/cloudtop/README.md)

## 画面截图

![首页](https://github.com/zhedh/netresource/blob/5b19826cccd3f4fb59fb117f7b3487ef84f77a9a/images/cloudtop/home.png)

![概览](https://github.com/zhedh/netresource/blob/5b19826cccd3f4fb59fb117f7b3487ef84f77a9a/images/cloudtop/overview.png)

![健康状况](https://github.com/zhedh/netresource/blob/5b19826cccd3f4fb59fb117f7b3487ef84f77a9a/images/cloudtop/health.png)

![地图](https://github.com/zhedh/netresource/blob/5b19826cccd3f4fb59fb117f7b3487ef84f77a9a/images/cloudtop/map.png)

![页面性能](https://github.com/zhedh/netresource/blob/5b19826cccd3f4fb59fb117f7b3487ef84f77a9a/images/cloudtop/performance.png)
