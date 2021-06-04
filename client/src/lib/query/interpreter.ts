import { TokenKind as TK, AbstractSyntaxTree as AST, AbstractSyntaxTreeOption as ASTO, AbstractSyntaxTreeConditional as ASTC } from './tokens'

export const interpret = (query: AST, host: any): boolean => {
  switch (query.type) {
    case 'conditional': return interpretConditional(query, host)
    case 'option': return interpretOption(query, host)
  }
}

const getRundown = (host: any) => host.rundown && host.rundown.actives && host.rundown.actives.length > 0 ? host.rundown.actives[0] : {}

function interpretOption({ key, value }: ASTO, host: any): boolean {
  switch (key) {
    case 'has':
    case 'is': return interpretOptionIs(value, host)
    case 'not': return interpretOptionNot(value, host)
    case 'n':
    case 'name': return interpretOptionName(value, host)
    default: throw new Error(`Unexpected option ${key}.`)
  }
}

function interpretOptionName(value: string, host: any) {
  return host.name.includes(value)
}

function interpretOptionIs(value: string, host: any): boolean {
  switch (value) {
    case 'qbox': return host.name.includes('qb')
    case 'ok': return host.health.status === 'OK'
    case 'fail': return host.health.status === 'FAIL'
    case 'warning': return host.health.status === 'WARNING'
    case 'active': return getRundown(host).active
    case 'inactive': return !getRundown(host).active
    case 'rehearsal':
      const rundown = getRundown(host)
      return rundown.active && rundown.rehearsal
    default: throw new Error(`Unexpected value ${value}.`)
  }
}
function interpretOptionNot(value: string, host: any): boolean {
  switch (value) {
    default: return !interpretOptionIs(value, host)
  }
}

function interpretConditional({ key, left, right }: ASTC, host: any): boolean {
  switch (key) {
    case 'and': return interpretConditionalAnd(left, right, host)
    case 'or': return interpretConditionalOr(left, right, host)
    default: throw new Error(`Unexpected conditional ${key}.`)
  }
}

function interpretConditionalAnd(left: AST, right: AST, host: any): boolean {
  return interpret(left, host) && interpret(right, host)
}

function interpretConditionalOr(left: AST, right: AST, host: any): boolean {
  return interpret(left, host) || interpret(right, host)
}

