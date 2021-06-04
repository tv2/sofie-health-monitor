import { parse } from './parser'
export * from './parser'
export * from './interpreter'
export const defaultQuery = parse('is:active')
