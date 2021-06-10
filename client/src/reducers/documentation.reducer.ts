import { ActionType } from '../actions/documentation.actions'

const initialState = {
  show: false,
}

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {

    case ActionType.SHOW_DOCUMENTATION: return { ...state, show: true }

    case ActionType.HIDE_DOCUMENTATION: return { ...state, show: false }

    case ActionType.TOGGLE_DOCUMENTATION: return { ...state, show: !state.show }

    default: return { ...state }
  }
}

export default reducer


