# Cloudtop 前端性能监控平台

- 数据概览：实时掌握项目的健康状态，PV/UV、报错、用户分布等。
- 错误分析：精细化分析每个报错问题。
- 用户细查：深入分析每个用户，记录用户的所有行为。
- 性能分析：分析页面和接口性能，加载耗时，成功率。

## 环境变量配置

| 变量           | 描述                     | 必填 | 默认值                   |
| :------------- | :----------------------- | :--- | :----------------------- |
| VITE_PORT      | 应用端口号               | 可选 | 8000                     |
| VITE_BASE_URL  | 监控平台服务域名         | 必填 | -                        |
| VITE_SHA1_SALT | sha1 KEY，配置后不可变更 | 可选 | 不填默认取代码中约定的值 |

参考.env 文件

```txt
# .env
VITE_PORT=8000
VITE_BASE_URL=http://localhost:3100
VITE_SHA1_SALT=1fbf5b59a36ce107ae19caee2eea20cc
```

## 开发

```bash
npm run dev
```

## 生产构建启动

```bash
npm run start
```
