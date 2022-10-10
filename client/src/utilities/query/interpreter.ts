import { TokenKind as TK, AbstractSyntaxTree as AST, AbstractSyntaxTreeOption as ASTOpt, AbstractSyntaxTreeOperator as ASTOpe } from './tokens'
import { getRundown } from './utilities'

export const interpret = (query: AST) => (host: any): boolean => {
  switch (query.type) {
    case 'operator': return interpretOperator(query, host)
    case 'option': return interpretOption(query, host)
  }
}

function interpretOption({ key, value }: ASTOpt, host: any): boolean {
  switch (key) {
    case 's':
    case 'status': return interpretOptionStatus(value, host)
    case 'r':
    case 'rundown': return interpretOptionRundown(value, host)
    case 'n':
    case 'name': return interpretOptionName(value, host)
    case 'is': return interpretOptionIs(value, host)
    default: throw new Error(`Unexpected option ${key}.`)
  }
}

function interpretOptionIs(value: string, host: any): boolean {
  switch (value) {
    case 'qbox': return host.name.includes('qb')
    default: throw new Error(`Unexpected rundown value '${value}'.`)
  }
}

function interpretOptionStatus(value: string, host: any): boolean {
  return host.state.health.status.toLowerCase().indexOf(value.toLowerCase()) === 0
}

function interpretOptionRundown(value: string, host: any): boolean {
  const rundown = getRundown(host)
  const lcValue = value.toLowerCase()
  if ('inactive'.indexOf(lcValue)  === 0) return !rundown.activationId && !rundown.rehearsal
  if ('rehearsal'.indexOf(lcValue) === 0) return !!rundown.activationId && rundown.rehearsal
  if ('active'.indexOf(lcValue)    === 0) return !!rundown.activationId && !rundown.rehearsal
  throw new Error(`Unexpected rundown value '${value}'.`)
}

function interpretOptionName(value: string, host: any) {
  return host.name.includes(value)
}

function interpretOperator({ key, left, right }: ASTOpe, host: any): boolean {
  switch (key) {
    case 'and': return interpretOperatorAnd(left, right, host)
    case 'or': return interpretOperatorOr(left, right, host)
    case '!': return interpretOperatorNot(left, right, host)
    default: throw new Error(`Unexpected operator '${key}'.`)
  }
}

function interpretOperatorAnd(left: AST, right: AST, host: any): boolean {
  return interpret(left)(host) && interpret(right)(host)
}

function interpretOperatorOr(left: AST, right: AST, host: any): boolean {
  return interpret(left)(host) || interpret(right)(host)
}

function interpretOperatorNot(left: AST, _: any, host: any): boolean {
  return !interpret(left)(host)
}
