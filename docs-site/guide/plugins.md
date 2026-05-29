# 插件体系

每个工具栏功能都应设计为独立插件，便于装配与二次开发。

## 插件最小结构

- `id`
- `toolbar`（`titleKey`）
- `i18n`（至少 `zh-CN`、`en-US`）
- 可选 `hooks`

## 工具栏渲染规则

1. 优先读取外部 `messages` 覆盖。
2. 回退到插件内置 i18n。
3. 仍缺失时回退到 `title` 或 `titleKey`。

## 内置插件

- `@ly-editor/plugin-basic-format`: 加粗、斜体、下划线
- `@ly-editor/plugin-block-tools`: 标题、引用、代码块、列表、分割线
- `@ly-editor/plugin-link-image`: 链接、图片
- `@ly-editor/plugin-table`: 表格
- `@ly-editor/plugin-style-tools`: 字体、字号、文字色、高亮色、删除线、行内代码
