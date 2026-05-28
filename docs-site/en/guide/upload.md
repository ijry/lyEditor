# Upload Guide

`POST /api/editor/upload/sign`

Request fields:
- `provider`
- `filename`
- `contentType`
- `size`

Response fields:
- OSS: `accessId`, `policy`, `signature`, `dir`, `host`, `expire`
- COS: `tmpSecretId`, `tmpSecretKey`, `sessionToken`, `startTime`, `expiredTime`, `bucket`, `region`, `key`
- Qiniu: `uploadToken`, `key`, `domain`, `expire`
