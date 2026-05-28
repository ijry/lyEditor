# Go (Gin)

```go
router.POST("/api/editor/upload/sign", func(c *gin.Context) {
  c.JSON(200, gin.H{
    "provider": "oss",
  })
})
```

## 调试建议

- 限制 body 大小
- 明确错误码与错误信息结构
- 结合 tracing 定位链路问题
