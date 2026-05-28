# Java（Spring Boot）

```java
@PostMapping("/api/editor/upload/sign")
public Map<String, Object> sign(@RequestBody SignRequest request) {
  return Map.of("provider", request.getProvider());
}
```
