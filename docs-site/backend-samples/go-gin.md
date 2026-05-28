# Go（Gin）

```go
router.POST("/api/editor/upload/sign", func(c *gin.Context) {
  c.JSON(200, gin.H{"provider": "oss"})
})
```
