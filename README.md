# Cloudtop 

---

Cloudtop 前端监控系统是一套集流量监控、错误监控、性能监控、接口监控于一体的监控平台，目前支持 Web 端接入。

## 文档

查看文档，请访问[cloudtop-docs](http://cloudtop-docs.juyangkaifa.com)。

## 预览

预览效果，请访问[Cloudtop 前端性能监控](http://cloudtop-monitor.juyangkaifa.com/)

## 变更记录

每个版本的详细变更都记录在[CHANGELOG](https://github.com/zhedh/cloudtop/blob/main/CHANGELOG.md)中。


---

## 快速开始

### 环境要求

+ Node.js 18 及以上版本。
+ Mysql 5.7 及以上版本。
+ elasticsearch 6.7.0。日志存储和检索服务使用的是mysql，不需要考虑。日志存储和检索服务使用 elastic 时，请选择6.7.0版本，其他版本请二次开发进行兼容。

### 下载克隆项目

```bash
git clone https://github.com/zhedh/cloudtop.git
```

### 配置文件

配置文件 .env 包含应用配置、mysql配置、elastic 配置（可选）；请将配置参数替换成你自己项目的配置再启动项目。

配置参考[环境变量](http://cloudtop-docs.juyangkaifa.com/config/env)

### 安装依赖

```bash
# 安装 pm2
npm i -g pm2
```

```bash
# 安装项目依赖
npm run init
```


### 运行项目

```bash
npm run start
```

如果您想配置多套环境，请新增配置文件如 .env.testing，启动项目时带上环境参数

```bash
npm run start testing
```

### 查看运行日志

```bash
# 查看全部日志
pm2 log
```

```bash
# 查看具体项目日志
pm2 log cloudtop_server
```

### 访问

前端性能监控数据大盘：[http://localhost:8000](http://localhost:8000)
