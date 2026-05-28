# 自定义插件实战

## 目标

实现一个 `highlight` 插件，在工具栏提供高亮按钮并支持中英文文案。

## 步骤

1. 定义插件元信息与 `id`。
2. 添加 `toolbar.titleKey`。
3. 添加 `i18n` 字典。
4. 在初始化阶段注册插件。

## 示例

```ts
const highlightPlugin = {
  id: 'highlight',
  toolbar: [{ key: 'highlight', group: 'inline', titleKey: 'toolbar.highlight' }],
  i18n: {
    'zh-CN': { 'toolbar.highlight': '高亮' },
    'en-US': { 'toolbar.highlight': 'Highlight' }
  }
}
```
