
export enum ActionType {
  SET_HOST = 'SET_HOST',
  SET_DISPLAY_HOSTS = 'SET_DISPLAY_HOSTS',
  SET_PROPERTY_HOST = 'SET_PROPERTY_HOST',
  REMOVE_PROPERTY_HOST = 'REMOVE_PROPERTY_HOST',
  SET_CURRENT_PROPERTY_PANEL = 'SET_CURRENT_PROPERTY_PANEL',
}

export function setHost(payload: { name: string, state: any }) {
  return { type: ActionType.SET_HOST, payload }
}

export function setDisplayHosts(payload: { name: string, state: any }[]) {
  return { type: ActionType.SET_DISPLAY_HOSTS, payload }
}

export function setPropertyHost(payload: { panel: string, host: string }) {
  return { type: ActionType.SET_PROPERTY_HOST, payload }
}

export function removePropertyHost(payload: { panel: string }) {
  return { type: ActionType.REMOVE_PROPERTY_HOST, payload }
}

export function setCurrentPropertyPanel(payload: string) {
  return { type: ActionType.SET_CURRENT_PROPERTY_PANEL, payload }
}
