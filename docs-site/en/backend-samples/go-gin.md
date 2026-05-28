# Go (Gin)

```go
router.POST("/api/editor/upload/sign", func(c *gin.Context) {
  c.JSON(200, gin.H{
    "provider": "oss",
  })
})
```

## Troubleshooting

- limit request body size
- return explicit error codes
- add tracing for upload link debugging
