# Next-Gen Rich Text Editor Design Spec

## 1. Scope And Goals

Build a new-generation rich text editor with a strict model/view separation:
- Core model and command engine based on `slate` without React dependency.
- View rendering and DOM patching based on `snabbdom`.
- Fully pluginized architecture: each toolbar capability is a plugin.
- Visual table experience with office-like interactions.
- Framework wrappers for Vue 2, Vue 3, and React.
- Out-of-box upload support: server upload, OSS/COS/Qiniu direct upload.
- `docs-site` powered by VitePress with integration and backend samples.

First release target (`v0.1`) includes:
- Enhanced common editor set: paragraph/heading, bold/italic/underline, color, align, list, quote, link, image, undo/redo, table, code block, divider, task list, shortcuts, markdown paste transform.
- Modern browser support: latest two major versions of Chrome/Edge/Safari, plus mobile H5 support.

## 2. Non-Goals (v0.1)

- Legacy browser support (IE11/old Android WebView).
- Collaborative editing, comments/annotations, track-change.
- Spreadsheet-grade advanced table features (formula, freeze panes, filtering/sorting).

## 3. Monorepo Structure (pnpm workspace)

- `packages/core`
  - Slate-based document model state, command bus, transactions, selection state.
  - No direct DOM operations.
- `packages/view-snabbdom`
  - Snabbdom renderer, vnode mapping, event bridge, patch lifecycle.
  - Only consumes core snapshots and updates DOM.
- `packages/plugin-kit`
  - Plugin protocol, lifecycle hooks, capability declaration, runtime validation.
- `packages/plugins/*`
  - Official plugins: text marks, block tools, link/image, table, upload, etc.
- `packages/upload`
  - Unified uploader interfaces and built-in adapters.
- `packages/vue2`
- `packages/vue3`
- `packages/react`
  - Thin framework wrappers with unified external API.
- `examples/vue2`, `examples/vue3`, `examples/react`
- `docs-site`
  - VitePress documentation and backend sample guides.

## 4. Core Architecture

### 4.1 Model/View Separation

- `core` owns editor state transitions only.
- `view-snabbdom` owns vnode generation and DOM patch only.
- User interactions route through `view -> command -> core -> snapshot -> view patch`.
- Plugins may extend behavior and rendering through defined extension points only.

### 4.2 Runtime Data Flow

1. Interaction captured by view layer (keyboard/mouse/IME).
2. View maps interaction to command and dispatches to core.
3. Core executes transaction and emits next immutable snapshot.
4. View computes vnode diffs and applies incremental patch.
5. Plugin hooks execute before/after command and on render extension points.

### 4.3 Stability Strategy

- Transaction rollback on command failure.
- Plugin isolation boundary: plugin exceptions cannot crash editor runtime.
- Schema validation guardrails for node/mark integrity.
- Dedicated IME composition channel to prevent Chinese input jitter.

## 5. Plugin System And Toolbar Protocol

### 5.1 Plugin Contract

Each plugin declares:
- `id`
- `schema?`
- `commands`
- `shortcuts?`
- `toolbar?`
- `renderers?`
- `hooks?` (`onInit`, `onDestroy`, `beforeCommand`, `afterChange`)

### 5.2 Toolbar Model

- Toolbar is driven by plugin metadata; no built-in hardcoded features.
- Grouped render: `inline`, `block`, `insert`, `table`, `upload`.
- Dynamic `active`/`disabled` state from current selection and editor query API.
- Supports custom panels/buttons from external developers.

### 5.3 Secondary Development API

- `editor.registerPlugin(plugin)`
- `editor.unregisterPlugin(id)`
- `editor.exec(command, payload?)`
- `editor.queryState(selector)`
- `editor.on(event, handler)` (`change`, `selection`, `error`, `upload`)
- `createPlugin(config)` helper with runtime contract validation

### 5.4 Compatibility And Isolation

- Capability declaration and dependency checks at plugin load time.
- Version negotiation via peer compatibility range.
- Degraded behavior with explicit warnings when optional capability is missing.

## 6. Table Experience Design

### 6.1 Slate Table Model

- `table`
- `table_row`
- `table_cell` with metadata: `rowSpan`, `colSpan`, `width`, `align`, `valign`
- Runtime `TableGrid` index for merged-cell addressing and selection math.

### 6.2 v0.1 Table UX (office-like)

- Multi-cell drag selection.
- Context menu for row/column insert/delete, merge/split, align, clear.
- Keyboard navigation (`Tab`, `Shift+Tab`, arrows, `Enter`).
- Column resize drag handles with consistent width propagation.

### 6.3 Table Commands

- `insertTable({ rows, cols })`
- `mergeCells(range)` / `splitCell(path)`
- `insertRowBefore/After`
- `insertColBefore/After`
- `removeRow/Col`
- `setCellStyle(range, style)`

All table commands run in transactions with schema revalidation and rollback safety.

## 7. Upload Architecture

### 7.1 Unified Upload Adapter

`packages/upload` defines `UploaderAdapter` and ships:
- `server-upload`
- `aliyun-oss-direct`
- `tencent-cos-direct`
- `qiniu-direct`

### 7.2 Frontend Upload Flow

1. File select and local validation.
2. Request backend signing endpoint.
3. Upload to storage (or backend relay upload).
4. Insert resource node into document.
5. Emit success/failure events with retry hooks.

### 7.3 Required Backend Signing API Contract

Endpoint:
- `POST /api/editor/upload/sign`

Request:
- `provider`
- `filename`
- `contentType`
- `size`

Response fields by provider:
- OSS: `accessId`, `policy`, `signature`, `dir`, `host`, `expire`
- COS: `tmpSecretId`, `tmpSecretKey`, `sessionToken`, `startTime`, `expiredTime`, `bucket`, `region`, `key`
- Qiniu: `uploadToken`, `key`, `domain`, `expire`

Security requirements:
- Auth check, file type and size whitelist, key path isolation, short-lived signature.

### 7.4 Backend Samples In Docs

Provide runnable samples in docs for:
- Node.js (Express)
- Java (Spring Boot)
- Go (Gin)

Each sample includes env config, endpoint implementation, local debug flow, and common issue troubleshooting.

## 8. Framework Wrappers

### 8.1 Unified External API

Shared props:
- `value`, `plugins`, `toolbar`, `upload`, `readonly`, `placeholder`

Shared events:
- `change`, `focus`, `blur`, `error`, `upload`

Shared methods:
- `getEditor()`, `exec()`, `getValue()`, `setValue()`, `destroy()`

### 8.2 Wrapper Implementation Strategy

- Vue2: options API-oriented wrapper, supports `v-model`.
- Vue3: `defineComponent` + `modelValue` contract.
- React: controlled/uncontrolled dual mode + `forwardRef` methods.
- Wrappers remain thin and delegate all behavior to core/view/plugin packages.

## 9. Documentation Site (VitePress)

`docs-site` sections:
- Getting Started
- Core Concepts
- Built-in Plugins
- Table Guide
- Upload Guide
- Backend Samples
- Extension Guide
- Migration Guide

## 10. Testing And Quality Gates

### 10.1 Test Layers

- Unit tests: core commands/schema/table/upload adapters.
- Integration tests: core + view + plugin interoperability.
- Wrapper tests: Vue2/Vue3/React API contract parity.
- E2E tests (Playwright): full user behavior scenarios.

### 10.2 Quality Baseline

- TypeScript strict mode.
- ESLint + Prettier.
- Command snapshot regression tests for behavior drift prevention.
- Plugin contract tests for official plugin compatibility.
- Performance baselines on large documents and large tables.

## 11. Release And Delivery

- Changesets-based multi-package release workflow.
- Synchronized major versions for `core`, `plugin-kit`, and `view-snabbdom`.
- Semantic versioning and migration notes for breaking changes.
- CI pipeline:
  - PR: lint + test + examples build + docs build.
  - Main: canary publish.
  - Tag: stable npm publish + docs deployment.

## 12. Milestone Breakdown

- M1: Monorepo bootstrap + core + view baseline.
- M2: Plugin kit + enhanced common plugins + toolbar engine.
- M3: Table office-like interactions.
- M4: Upload adapters + backend samples.
- M5: Vue2/Vue3/React wrappers + examples.
- M6: Docs-site completion + release hardening.

## 13. Acceptance Criteria

- Core works without React and is driven by Slate model commands.
- Snabbdom view patch is isolated from model state internals.
- Every toolbar item is implemented as plugin package.
- Table supports visual multi-selection, context menu, merge/split, keyboard navigation.
- Upload supports server relay and OSS/COS/Qiniu direct upload via signed backend endpoint.
- Vue2/Vue3/React wrappers provide aligned public API.
- `docs-site` is VitePress and includes backend samples for Node/Java/Go.
