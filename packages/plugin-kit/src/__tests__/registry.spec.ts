import { describe, expect, it } from 'vitest'
import { createPluginRegistry } from '../create-plugin-registry'

describe('plugin registry', () => {
  it('collects toolbar entries from plugins', () => {
    const registry = createPluginRegistry()
    registry.register({
      id: 'bold',
      toolbar: [{ key: 'bold', group: 'inline', title: 'Bold' }]
    })
    expect(registry.getToolbar().length).toBe(1)
  })
})
