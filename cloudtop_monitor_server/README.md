# Cloudtop 前端性能监控平台服务端

用于检索性能上报数据，统计加载速度、响应效率、资源消耗等关键性能指标进行追踪和评估。

## 环境变量配置

| 变量                         | 描述           | 必填 | 默认值 |
| :--------------------------- | :------------- | :--- | :----- |
| CLOUDTOP_MONITOR_SERVER_PORT | 应用端口号     | 可选 | 3100   |
| CLOUDTOP_ELASTIC_NODE        | Elastic 连接   | 必填 | -      |
| CLOUDTOP_ELASTIC_USERNAME    | Elastic 账号   | 必填 | -      |
| CLOUDTOP_ELASTIC_PASSWORD    | Elastic 密码   | 必填 | -      |
| CLOUDTOP_ELASTIC_INDEX       | Elastic 索引   | 必填 | -      |
| CLOUDTOP_ELASTIC_TYPE        | Elastic 类型   | 必填 | -      |
| CLOUDTOP_DATABASE_HOST       | Mysql 主机     | 必填 | -      |
| CLOUDTOP_DATABASE_PORT       | Mysql 端口号   | 必填 | -      |
| CLOUDTOP_DATABASE_USER       | Mysql 账号     | 必填 | -      |
| CLOUDTOP_DATABASE_PASSWORD   | Mysql 密码     | 必填 | -      |
| CLOUDTOP_DATABASE_DATABASE   | Mysql 数据库名 | 必填 | -      |

新建 .env 并写入环境变量，配置参考 .env.example 文件

注：.env.example 将作为根项目的写入模版，文件不可删除，也不要随意修改
注：Elastic 配置需与监控平台服务保持一致

```txt
# 应用端口号。Docker 部署时需要 EXPOSE
CLOUDTOP_MONITOR_SERVER_PORT=3100

# Elastic
CLOUDTOP_ELASTIC_NODE=http://xxx.elasticsearch.aliyuncs.com:9200 # 连接（域名+端口号）
CLOUDTOP_ELASTIC_USERNAME=elastic # 账号
CLOUDTOP_ELASTIC_PASSWORD=12345678 # 密码
CLOUDTOP_ELASTIC_INDEX=cloudtop_logs # 索引（库名）
CLOUDTOP_ELASTIC_TYPE=cloudtop_log # 类型（表名）

# Database
CLOUDTOP_DATABASE_HOST=xxx.mysql.rds.aliyuncs.com
CLOUDTOP_DATABASE_PORT=3306
CLOUDTOP_DATABASE_USER=admin
CLOUDTOP_DATABASE_PASSWORD=admin123
CLOUDTOP_DATABASE_DATABASE=cloudtop
```

## 开发

启动服务并监听

```bash
npm run dev
```

监听文件变化重新构建

```bash
npm run watch
```

## 打包部署

```bash
npm run start
```

## 接口错误码映射

| 模块      | 代码    |
| :-------- | :------ |
| project   | 000-099 |
| user      | 100-199 |
| dashboard | 200-299 |
| behavior  | 300-399 |
| error     | 400-499 |
