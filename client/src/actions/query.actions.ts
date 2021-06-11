import { Query } from '../utilities/query/tokens'

export enum ActionType {
  SET_FILTER_QUERY = 'SET_FILTER_QUERY',
  SET_SORT_OPTIONS = 'SET_SORT_OPTIONS',
}

export function setFilterQuery(payload: Query['filter']) {
  return { type: ActionType.SET_FILTER_QUERY, payload }
}

export function setSortOptions(payload: Query['sort']) {
  return { type: ActionType.SET_SORT_OPTIONS, payload }
}
