import { ActionType } from '../actions/hosts.actions'

const initialState = {
  raw: {},
  display: [],
  property: [],
  currentPanel: 'default',
}

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case ActionType.SET_HOST:
      return { ...state, raw: { ...state.raw, [action.payload.name]: action.payload.state } }

    case ActionType.SET_DISPLAY_HOSTS:
      return { ...state, display: action.payload }

    case ActionType.SET_PROPERTY_HOST:
      return { ...state, property: setPropertyHost(action.payload, state.property) }

    case ActionType.REMOVE_PROPERTY_HOST:
      return { ...state, property: state.property.filter((prop: any) => prop.panel !== action.payload.panel) }

    case ActionType.SET_CURRENT_PROPERTY_PANEL:
      return { ...state, currentPanel: action.payload }

    default:
      return { ...state }
  }
}

export default reducer

function setPropertyHost({ panel, host }: any, properties: any[]) {
  if (properties.filter((p) => p.panel === panel).length > 0) {
    return properties.map((p) => (p.panel === panel ? { panel, host } : p))
  } else {
    return [...properties, { panel, host }]
  }
}
