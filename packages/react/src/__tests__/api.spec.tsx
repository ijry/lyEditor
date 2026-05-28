// @vitest-environment jsdom
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LyEditor } from '../LyEditor'

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
})
