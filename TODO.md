# 待办事项

**_ JS 错误分类 category 记录值不对 _**

应用归属：

> cloudtop

错误描述：

> category 与 error 中的错误类型不匹配，并且行号和列号会出现都为 0 的情况

错误日志：

```json
{
  "pid": "cloudshop_admin",
  "type": "error",
  "env": "production",
  "report_time": 1711608640172,
  "date": 1711608640172,
  "ct": "4g",
  "http_referer": "https://zhdg-cloudshop-admin.mengniu.cn/",
  "http_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "browser": "Chrome",
  "browser_version": "122.0.0.0",
  "device": "",
  "engine": "Blink",
  "engine_version": "122.0.0.0",
  "os": "Windows",
  "os_version": "10",
  "device_type": "pc",
  "ip_isp": "联通",
  "ip_country": "中国",
  "ip_country_id": "CN",
  "ip_region": "上海",
  "ip_region_id": "31",
  "ip_region_name": "上海市",
  "ip_city": "上海",
  "ip_city_id": "3101",
  "ip_city_name": "上海市",
  "remote_addr": "210.13.84.10",
  "sid": "",
  "pv_id": "5b2e6523-a1df-4675-82d9-0aad6b0aebe3",
  "page": "/commission/commissionlist/commissionadd",
  "src": "https://zhdg-cloudshop-admin.mengniu.cn/commission/commissionlist/commissionadd",
  "sr": "1536*864",
  "vp": "1536*714",
  "uid": "4b6468be-fb87-4157-b31b-2d121bd36edc",
  "login_id": "13671666779",
  "category": "CustomError",
  "msg": "Cannot read properties of null (reading 'bizType')",
  "stack": "",
  "file": "",
  "line": 0,
  "col": 0,
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of null (reading 'bizType')",
    "stack": "TypeError: Cannot read properties of null (reading 'bizType')\n    at Z (https://zhdg-cloudshop-admin.mengniu.cn/assets/index.040f44f5.js:60:1844)"
  }
}
```

**_ 资源引用错误日志 src 字段冲突 _**

应用归属：

> cloudtop

错误描述：

> 资源引用错误日志被监控目标地址和资源地址都使用了 src

**_ cloudtop_monitor 应用打包优化 _**