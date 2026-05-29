# Plugins

Every feature should be built as a plugin to keep the editor composable.

## Minimal Shape

- `id`
- `toolbar` (`titleKey`)
- `i18n` (at least `zh-CN` and `en-US`)
- optional `hooks`

## Built-in Plugins

- `@ly-editor/plugin-basic-format`: bold, italic, underline
- `@ly-editor/plugin-block-tools`: heading, quote, code block, list, divider
- `@ly-editor/plugin-link-image`: link, image
- `@ly-editor/plugin-table`: table
- `@ly-editor/plugin-style-tools`: font family, font size, text color, highlight, strike, inline code
