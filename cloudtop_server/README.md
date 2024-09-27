# Cloudtop 前端性能日志上报服务端

用于接收探针上报的性能、错误日志，存入 Elastic

## 环境变量配置

| 变量                      | 描述         | 必填 | 默认值 |
| :------------------------ | :----------- | :--- | :----- |
| CLOUDTOP_SERVER_PORT      | 应用端口号   | 可选 | 3000   |
| CLOUDTOP_ELASTIC_NODE     | Elastic 连接 | 必填 | -      |
| CLOUDTOP_ELASTIC_USERNAME | Elastic 账号 | 必填 | -      |
| CLOUDTOP_ELASTIC_PASSWORD | Elastic 密码 | 必填 | -      |
| CLOUDTOP_ELASTIC_INDEX    | Elastic 索引 | 必填 | -      |
| CLOUDTOP_ELASTIC_TYPE     | Elastic 类型 | 必填 | -      |

新建 .env 并写入环境变量，配置参考 .env.example 文件

注：.env.example 将作为根项目的写入模版，文件不可删除，也不要随意修改
注：Elastic 配置需与监控平台服务保持一致

```txt
# 应用端口号。Docker 部署时需要 EXPOSE
CLOUDTOP_SERVER_PORT=3000

# Elastic
CLOUDTOP_ELASTIC_NODE=http://xxx.elasticsearch.aliyuncs.com:9200 # 连接（域名+端口号）
CLOUDTOP_ELASTIC_USERNAME=elastic # 账号
CLOUDTOP_ELASTIC_PASSWORD=12345678 # 密码
CLOUDTOP_ELASTIC_INDEX=cloudtop_logs # 索引（库名）
CLOUDTOP_ELASTIC_TYPE=cloudtop_log # 类型（表名）
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
