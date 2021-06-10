import { ActionType } from '../actions/query.actions'

const initialState = {
  filter: {
    type: 'option',
    key: 'name',
    value: '',
  },
  sort: [{
    strategy: 'name',
    asc_order: true,
  }],
}

const reducer = (state: any = initialState, action: any) => {
  switch (action.type) {

    case ActionType.SET_FILTER_QUERY: return { ...state,
      filter: action.payload,
    }

    case ActionType.SET_SORT_OPTIONS: return { ...state,
      sort: action.payload,
    }

    default: return { ...state }
  }
}

export default reducer

