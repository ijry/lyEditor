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

## Troubleshooting

- check timezone consistency
- validate request body fields
- avoid logging sensitive credentials
