# 上传集成

`POST /api/editor/upload/sign`

## 请求字段

- `provider`
- `filename`
- `contentType`
- `size`

## 响应字段

- OSS: `accessId`, `policy`, `signature`, `dir`, `host`, `expire`
- COS: `tmpSecretId`, `tmpSecretKey`, `sessionToken`, `startTime`, `expiredTime`, `bucket`, `region`, `key`
- 七牛: `uploadToken`, `key`, `domain`, `expire`

## 接入建议

- 签名有效期尽量短。
- 对上传目录做租户隔离。
- 服务端做类型和大小白名单校验。
