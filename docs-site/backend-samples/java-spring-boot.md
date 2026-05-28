# Java (Spring Boot)

```java
@PostMapping("/api/editor/upload/sign")
public Map<String, Object> sign(@RequestBody SignRequest request) {
  return Map.of(
    "provider", request.getProvider(),
    "filename", request.getFilename()
  );
}
```

## 调试建议

- 检查时区与时间戳
- 对请求体做参数校验
- 日志脱敏后再输出
