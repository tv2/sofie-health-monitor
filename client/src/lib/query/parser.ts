import { TokenKind as TK, AbstractSyntaxTree as AST } from './tokens'
import { lexit } from './lexer'

import { expectSingleResult, expectEOF, Token } from 'typescript-parsec'
import { rule, apply, tok, opt_sc, lrec_sc, seq, alt, kmid, str } from 'typescript-parsec'

// Define rules
const EXP = rule<TK, AST>()
const EXP1 = rule<TK, AST>()
const LEAF = rule<TK, AST>()

// Define leafs
const applyValue = (value: Token<any>) => { console.log('val', value.text.slice(1,-1)); return { ...value, text: value.text[0] === '"' ? value.text.slice(1,-1) : value.text } }
const parseValue = apply(tok(TK.Value), applyValue)
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

const parser = EXP

export function parse(input: string): AST {
  return expectSingleResult(
    expectEOF(
      parser.parse(
        lexit.parse(input)
      )
    )
  ) as unknown as AST
}