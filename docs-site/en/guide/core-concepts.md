# Core Concepts

## Layered Architecture

- `@ly-editor/core`: model state, commands, transactions
- `@ly-editor/view-snabbdom`: rendering and event bridge
- `@ly-editor/plugin-kit`: plugin contract and toolbar metadata

## Data Flow

1. user interaction enters view layer
2. event mapped to command
3. core emits updated snapshot
4. view applies incremental update
