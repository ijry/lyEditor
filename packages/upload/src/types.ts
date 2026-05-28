export interface UploadContext {
  file: File
}

export interface UploadAdapter {
  upload: (ctx: UploadContext) => Promise<{ url: string }>
}
