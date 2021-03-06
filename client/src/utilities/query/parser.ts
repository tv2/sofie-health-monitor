import { TokenKind as TK, AbstractSyntaxTree as AST, Query, QuerySortOption } from './tokens'
import { lexit } from './lexer'

import { expectSingleResult, expectEOF, Token } from 'typescript-parsec'
import { rule, apply, tok, opt_sc, rep_sc, lrec_sc, seq, alt, kmid, str } from 'typescript-parsec'

// Define rules
const EXP = rule<TK, AST>()
const EXP1 = rule<TK, AST>()
const LEAF = rule<TK, AST>()

// Define leafs
const applyValue = (value: Token<any>) => ({ ...value, text: value.text[0] === '"' ? value.text.slice(1,-1) : value.text })
const parseValue = apply(alt(tok(TK.Value), str('or'), str('and')), applyValue)
const parseOption = seq(
  tok(TK.Key),
  tok(TK.Colon),
  alt(parseValue, tok(TK.Key)),
)

const applyOption = ([key, _, value]: any) => ({
  type: 'option',
  key: key.text,
  value: value.text,
}) as AST

const nameLiteral = parseValue

const applyNameLiteral = (name: Token<any>): AST => ({
  type: 'option',
  key: 'name',
  value: name.text,
})

const applyNot = ([_, value]:[any, AST]): AST => {
  return {
    type: 'operator',
    key: '!',
    left: value,
    right: null as unknown as AST, // TODO: Create Unary Operator
  }
}

LEAF.setPattern(
  alt(
    apply(nameLiteral, applyNameLiteral),
    apply(parseOption, applyOption),
    kmid(str('('), EXP, str(')')),
    apply(seq(str('!'), LEAF), applyNot)
  )
)

// Define top Expr
const applyExpr = (left: AST, [op, right]: [Token<any>, AST]): AST => ({
  type: 'operator',
  key: op.text,
  left,
  right,
})

EXP.setPattern(
  lrec_sc(EXP1, seq(str('or'), EXP), applyExpr)
)

// Define first Expr layer
EXP1.setPattern(
  lrec_sc(LEAF, seq(str('and'), EXP), applyExpr)
)

const applySort = ([_o, _c, value]: any): QuerySortOption => {
  const strategy = value && value.text.split('.')[0]
  const order = value && value.text.split('.').length > 1 ? value.text.split('.')[1] : ''
  return {
    strategy,
    asc_order: order === 'asc'
  }
}
const parseSort = rep_sc(apply(seq(tok(TK.SortKey), tok(TK.Colon), tok(TK.Value)), applySort))

const verifySortStrategy = (strategy: string) => {
  if (!['name', 'status', 'rundown'].includes(strategy)) {
    throw new Error(`Unexpected order '${strategy}'.`)
  }
}

const applyParser = ([filter, sort]: any): Query => {
  if (sort) sort.map((s: QuerySortOption) => verifySortStrategy(s.strategy))
  return {
    filter: filter || {
      type: 'option',
      key: 'name',
      value: '',
    },
    sort: sort.length && sort || [{
      strategy: 'name',
      asc_order: true,
    }]
  }
}
const parser = apply(seq(opt_sc(EXP), opt_sc(parseSort)), applyParser)

export function parse(input: string): Query {
  return expectSingleResult(
    expectEOF(
      parser.parse(
        lexit.parse(input)
      )
    )
  )
}
