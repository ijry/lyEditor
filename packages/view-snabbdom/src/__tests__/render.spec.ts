// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createView } from '../create-view'

describe('snabbdom view', () => {
  it('renders snapshot text into container', () => {
    const container = document.createElement('div')
    const view = createView(container)
    view.render({ plainText: 'hello snabbdom' })
    expect(container.textContent).toContain('hello snabbdom')
  })
})
