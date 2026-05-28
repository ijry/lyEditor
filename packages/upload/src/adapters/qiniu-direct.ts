import type { UploadAdapter } from '../types'

export function createQiniuDirectAdapter(host: string): UploadAdapter {
  return {
    async upload(ctx) {
      return { url: `${host}/${encodeURIComponent(ctx.file.name)}` }
    }
  }
}
