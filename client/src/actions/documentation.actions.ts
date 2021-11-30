export enum ActionType {
  TOGGLE_DOCUMENTATION = 'TOGGLE_DOCUMENTATION',
  SHOW_DOCUMENTATION = 'SHOW_DOCUMENTATION',
  HIDE_DOCUMENTATION = 'HIDE_DOCUMENTATION',
}

export function toggleDocumentation() {
  return { type: ActionType.TOGGLE_DOCUMENTATION }
}

export function showDocumentation() {
  return { type: ActionType.SHOW_DOCUMENTATION }
}

export function hideDocumentation() {
  return { type: ActionType.HIDE_DOCUMENTATION }
}
