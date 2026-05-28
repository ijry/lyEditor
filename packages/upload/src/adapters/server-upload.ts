import type { UploadAdapter } from '../types'

export function createServerUploadAdapter(input: { signUrl: string }): UploadAdapter {
  return {
    async upload() {
      return { url: `${input.signUrl}/mock-file-url` }
    }
  }
}
