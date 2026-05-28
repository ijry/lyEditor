# Upload Integration

`POST /api/editor/upload/sign`

## Request Fields

- `provider`
- `filename`
- `contentType`
- `size`

## Response Fields

- OSS: `accessId`, `policy`, `signature`, `dir`, `host`, `expire`
- COS: `tmpSecretId`, `tmpSecretKey`, `sessionToken`, `startTime`, `expiredTime`, `bucket`, `region`, `key`
- Qiniu: `uploadToken`, `key`, `domain`, `expire`
