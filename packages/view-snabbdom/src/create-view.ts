import { h, init } from 'snabbdom'

const patch = init([])

export function createView(container: HTMLElement) {
  const mountPoint = document.createElement('div')
  container.replaceChildren(mountPoint)

  let vnode = mountPoint as unknown as ReturnType<typeof h>

  return {
    render(snapshot: { plainText: string }) {
      vnode = patch(vnode, h('div.ly-editor-view', snapshot.plainText)) as ReturnType<typeof h>
    }
  }
}
