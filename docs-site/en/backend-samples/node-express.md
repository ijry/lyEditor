# Node.js (Express)

```js
app.post('/api/editor/upload/sign', async (req, res) => {
  const { provider, filename, contentType, size } = req.body
  res.json({ provider, filename, contentType, size })
})
```

## Troubleshooting

- validate CORS
- validate server clock
- validate object storage permissions
