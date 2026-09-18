// @vitest-environment jsdom

import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { GooeyPiMark } from '../../src/components/ui'
import { GOOEYPI_MASCOT_SRC } from '../../src/lib/assets'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container: HTMLDivElement

afterEach(() => {
  container?.remove()
})

describe('renderer asset paths', () => {
  it.each([
    ['the packaged renderer protocol', 'prime-work://app/index.html', 'prime-work://app/gooeypi-mascot.png'],
    ['the vite dev server', 'http://localhost:5173/index.html', 'http://localhost:5173/gooeypi-mascot.png'],
    ['a file:// renderer', 'file:///app/out/renderer/index.html', 'file:///app/out/renderer/gooeypi-mascot.png'],
  ])('resolves the mascot beside index.html under %s', (_mode, documentUrl, expected) => {
    expect(new URL(GOOEYPI_MASCOT_SRC, documentUrl).href).toBe(expected)
  })

  it('does not anchor the mark to the serving origin', async () => {
    container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    await act(async () => { root.render(<GooeyPiMark size={48} />) })

    const img = container.querySelector('img')
    expect(img?.getAttribute('src')).toBe(GOOEYPI_MASCOT_SRC)
    expect(img?.getAttribute('src')).not.toMatch(/^\//)
    await act(async () => { root.unmount() })
  })
})
