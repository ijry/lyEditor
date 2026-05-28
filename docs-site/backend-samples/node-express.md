# Node.js (Express)

```js
app.post('/api/editor/upload/sign', async (req, res) => {
  const { provider, filename, contentType, size } = req.body

  // 这里按 provider 生成不同厂商的签名参数
  // 示例仅返回透传结构
  res.json({ provider, filename, contentType, size })
})
```

## 调试建议

- 校验跨域配置
- 校验服务端时间同步
- 校验上传目录权限
