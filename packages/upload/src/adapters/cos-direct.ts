import type { UploadAdapter } from '../types'

export function createCosDirectAdapter(host: string): UploadAdapter {
  return {
    async upload(ctx) {
      return { url: `${host}/${encodeURIComponent(ctx.file.name)}` }
    }
  }
}
