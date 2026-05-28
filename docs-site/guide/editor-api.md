# 编辑器 API

## 组件输入

- `locale`: 当前语言（如 `zh-CN`、`en-US`）
- `messages`: 自定义语言覆盖表
- `plugins`: 插件集合
- `readonly`: 只读模式开关

## 常用方法

- `exec(command, payload)`
- `getValue()`
- `setValue(value)`
- `destroy()`

## 事件建议

业务侧建议统一监听 `change`、`error`、`upload`，将上报与埋点集中处理。
