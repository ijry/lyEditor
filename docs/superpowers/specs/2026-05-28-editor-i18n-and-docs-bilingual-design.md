# Editor I18n And Docs Bilingual Design Spec

## 1. Goal

Add multilingual capability to both editor UI and docs site with first release support for Chinese and English.

- Editor i18n:
  - Built-in locales: `zh-CN`, `en-US`
  - Controlled locale switching via wrapper prop
  - Developer override/extension via custom messages
- Docs i18n:
  - Chinese at `/`
  - English at `/en/`

## 2. Scope

### In Scope

- Unified i18n store for editor runtime.
- Plugin toolbar titles migrated to key-based translation.
- Vue2/Vue3/React wrappers expose consistent i18n props.
- VitePress bilingual site structure and navigation.
- Chinese/English docs pages for current docs coverage.

### Out Of Scope

- Additional locale rollout beyond `zh-CN` and `en-US`.
- Third-party i18n framework integration (for now).
- Automatic browser-language detection in wrappers.

## 3. Architecture

### 3.1 Editor I18n Core (plugin-kit)

Add i18n runtime in `packages/plugin-kit`:

- `createI18nStore(options)`
- `setLocale(locale)`
- `mergeMessages(locale, messages)`
- `t(key, params?)`

Default behavior:
- default locale: `zh-CN`
- fallback chain: `currentLocale -> en-US -> key`

### 3.2 Plugin Protocol Update

Extend plugin contract:

- `toolbar.titleKey?: string`
- `toolbar.title?: string` (deprecated compatibility fallback)
- `plugin.i18n?: Record<string, Record<string, string>>`

Toolbar rendering behavior:
- Prefer `titleKey` and resolve via `t()`.
- If only `title` exists, use `title` and print deprecation warning.

### 3.3 Wrapper API Contract (Vue2/Vue3/React)

All wrappers expose the same i18n props:

- `locale?: string`
- `messages?: Record<string, Record<string, string>>`

Runtime contract:
- `locale` is controlled by external app.
- `messages` are merged into store on init/update.
- locale update triggers immediate toolbar text refresh.

### 3.4 Docs Bilingual Structure (VitePress)

Use VitePress locales:

- root locale (Chinese): `/`
- english locale: `/en/`

Content mapping:

- Chinese existing pages remain in root paths.
- English mirrored pages under `docs-site/en/**`.
- Nav/sidebar structure remains consistent across locales.

## 4. Translation Key Strategy

Key naming examples:

- `toolbar.bold`
- `toolbar.italic`
- `toolbar.underline`
- `toolbar.heading`
- `toolbar.list`
- `toolbar.quote`
- `toolbar.taskList`
- `toolbar.codeBlock`
- `toolbar.divider`
- `toolbar.link`
- `toolbar.image`
- `toolbar.upload`
- `toolbar.table`
- `table.mergeCells`
- `table.splitCell`
- `table.insertRow`
- `table.insertCol`
- `table.deleteRow`
- `table.deleteCol`

Rules:
- Plugins must reference keys, not hardcoded UI strings.
- Built-in plugin i18n dictionaries include both `zh-CN` and `en-US`.

## 5. Implementation Plan At Code Level

- `packages/plugin-kit`
  - Add i18n store module.
  - Update plugin types and registry merge logic for `plugin.i18n`.
- `packages/plugins/*`
  - Replace `toolbar.title` with `titleKey`.
  - Add locale dictionaries in each plugin.
- `packages/react`, `packages/vue2`, `packages/vue3`
  - Add `locale/messages` props and pass to shared editor runtime.
- `docs-site/.vitepress/config.ts`
  - Add bilingual locales config and locale-specific nav/sidebar.
- `docs-site/en/*`
  - Add English pages mirroring current Chinese structure.

## 6. Compatibility And Migration

- Existing plugins using `toolbar.title` continue to work.
- New plugin authoring guide recommends `titleKey + i18n`.
- Runtime warns when deprecated `title` is used.

## 7. Testing And Verification

### Unit Tests

- i18n fallback chain:
  - locale hit
  - fallback to `en-US`
  - fallback to key
- plugin i18n merge precedence:
  - built-in < custom messages
- legacy title compatibility path.

### Wrapper Tests

- React/Vue wrappers apply `locale/messages` correctly.
- locale updates trigger rerender text change.

### Docs Validation

- `pnpm --filter docs-site docs:build` passes.
- Generated output contains both root and `/en/` routes.

## 8. Acceptance Criteria

- Editor supports controlled locale switching with `zh-CN` and `en-US` built-in.
- Developers can override/add messages via `messages` prop.
- Toolbar/plugin UI strings come from translation keys.
- Docs site serves Chinese at `/` and English at `/en/`.
- Current docs sections exist in both locales and build successfully.
