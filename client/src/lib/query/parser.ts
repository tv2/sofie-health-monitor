import { TokenKind as TK, AbstractSyntaxTree as AST } from './tokens'
import { lexit } from './lexer'

import { expectSingleResult, expectEOF, Token } from 'typescript-parsec'
import { rule, apply, tok, opt_sc, lrec_sc, seq, alt, kmid, str } from 'typescript-parsec'

// Define rules
const EXP = rule<TK, AST>()
const EXP1 = rule<TK, AST>()
const LEAF = rule<TK, AST>()

// Define leafs
const parseOption = seq(
  tok(TK.Key),
  tok(TK.Colon),
  tok(TK.Value),
)

const applyOption = ([key, _, value]: any) => ({
  type: 'option',
  key: key.text,
  value: value.text,
}) as AST

const nameLiteral = tok(TK.Value)

const applyNameLiteral = (name: Token<any>): AST => ({
  type: 'option',
  key: 'name',
  value: name.text,
})

LEAF.setPattern(
  alt(
    apply(nameLiteral, applyNameLiteral),
    apply(parseOption, applyOption),
    kmid(str('('), EXP, str(')'))
  )
)

// Define top Expr
const applyExpr = (left: AST, [condOp, right]: [Token<any>, AST]): AST => ({
  type: 'conditional',
  key: condOp.text,
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
