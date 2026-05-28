export interface ViewCommandEvent {
  type: string
  payload?: unknown
}

export type ViewCommandHandler = (event: ViewCommandEvent) => void

export function createEventBridge(handler: ViewCommandHandler) {
  return {
    emit(event: ViewCommandEvent) {
      handler(event)
    }
  }
}
