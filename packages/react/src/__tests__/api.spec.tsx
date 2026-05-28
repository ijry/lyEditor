// @vitest-environment jsdom
import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LyEditor } from '../LyEditor'

afterEach(() => cleanup())

describe('react wrapper api', () => {
  it('accepts locale prop and exposes locale marker', () => {
    render(
      React.createElement(LyEditor, {
        locale: 'en-US',
        messages: { 'en-US': { 'toolbar.bold': 'Bold' } }
      })
    )

    expect(screen.getByTestId('ly-editor-root').getAttribute('data-locale')).toBe('en-US')
    expect(screen.getByTestId('ly-editor-root').getAttribute('data-has-messages')).toBe('1')
  })

  it('uses default markers when locale and messages are omitted', () => {
    render(React.createElement(LyEditor))

    expect(screen.getByTestId('ly-editor-root').getAttribute('data-locale')).toBe('zh-CN')
    expect(screen.getByTestId('ly-editor-root').getAttribute('data-has-messages')).toBe('0')
  })
})
