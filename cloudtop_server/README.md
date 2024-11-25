# Cloudtop 前端性能日志上报服务端

用于接收探针上报的 PV、性能、错误日志，存入数据库。
日志存储和检索方式支持 Elastic、Mysql，请根据实际需要进行选择。

## 环境变量配置

**应用配置**

| 变量                   | 描述                        | 必填 | 默认值 |
| :--------------------- | :-------------------------- | :--- | :----- |
| CLOUDTOP_SERVER_PORT   | 应用端口号                  | 可选 | 3000   |
| CLOUDTOP_LOGSTORE_TYPE | 日志存储方式 mysql、elastic | 可选 | mysql  |

**Mysql 配置**

| 变量                       | 描述   | 必填 | 默认值 |
| :------------------------- | :----- | :--- | :----- |
| CLOUDTOP_DATABASE_HOST     | 主机   | 必填 | -      |
| CLOUDTOP_DATABASE_PORT     | 端口号 | 必填 | -      |
| CLOUDTOP_DATABASE_USER     | 账号   | 必填 | -      |
| CLOUDTOP_DATABASE_PASSWORD | 密码   | 必填 | -      |
| CLOUDTOP_DATABASE_DATABASE | 数据库 | 必填 | -      |

**Elastic 配置**

CLOUDTOP_LOGSTORE_TYPE=elastic 时必填

| 变量                      | 描述         | 必填 | 默认值 |
| :------------------------ | :----------- | :--- | :----- |
| CLOUDTOP_ELASTIC_NODE     | Elastic 连接 | 必填 | -      |
| CLOUDTOP_ELASTIC_USERNAME | Elastic 账号 | 必填 | -      |
| CLOUDTOP_ELASTIC_PASSWORD | Elastic 密码 | 必填 | -      |
| CLOUDTOP_ELASTIC_INDEX    | Elastic 索引 | 必填 | -      |
| CLOUDTOP_ELASTIC_TYPE     | Elastic 类型 | 必填 | -      |

**配置说明**

新建 .env 并写入环境变量，配置参考 .env.example 文件

注：.env.example 将作为根项目的写入模版，文件不可删除，也不要随意修改
注：Mysql、Elastic 配置需与监控平台服务保持一致

```txt
# .env.example

# 应用端口号。Docker 部署时需要 EXPOSE
CLOUDTOP_SERVER_PORT=3000 # 应用端口号
CLOUDTOP_LOGSTORE_TYPE=mysql

# Elastic
CLOUDTOP_ELASTIC_NODE=http://xxx.elasticsearch.aliyuncs.com:9200 # 连接（域名+端口号）
CLOUDTOP_ELASTIC_USERNAME=xxx # 账号
CLOUDTOP_ELASTIC_PASSWORD=xxx # 密码
CLOUDTOP_ELASTIC_INDEX=cloudtop_logs # 索引（库名）
CLOUDTOP_ELASTIC_TYPE=cloudtop_log # 类型（表名）

# Database
CLOUDTOP_DATABASE_HOST=xxx.mysql.rds.aliyuncs.com # 主机
CLOUDTOP_DATABASE_PORT=3306 # 端口号
CLOUDTOP_DATABASE_USER=xxx # 账号
CLOUDTOP_DATABASE_PASSWORD=xxx # 密码
CLOUDTOP_DATABASE_DATABASE=cloudtop #数据库
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
