# 上传指南

`POST /api/editor/upload/sign`

请求字段：
- `provider`
- `filename`
- `contentType`
- `size`

响应字段：
- OSS：`accessId`、`policy`、`signature`、`dir`、`host`、`expire`
- COS：`tmpSecretId`、`tmpSecretKey`、`sessionToken`、`startTime`、`expiredTime`、`bucket`、`region`、`key`
- 七牛：`uploadToken`、`key`、`domain`、`expire`
