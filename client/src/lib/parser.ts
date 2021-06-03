import * as Parsec from 'typescript-parsec'

enum TokenKind {
  Colon,
  Comma,
  Parameter,
  Argument,
  Space,
}

const lexer = Parsec.buildLexer([
  [true, /^:/g, TokenKind.Colon],
  [true, /^,/g, TokenKind.Comma],
  [true, /^(?:true|false|-?[0-9]+)/g, TokenKind.Argument],
  [true, /^[a-zA-Z][a-zA-z_0-9]+/g, TokenKind.Parameter],
  [true, /^\s+/g, TokenKind.Space]
])

// const parser = Parsec.seq(Parsec.tok(TokenKind.Colon), Parsec.str(','))
const parser = Parsec.list_sc(Parsec.seq(Parsec.tok(TokenKind.Parameter), Parsec.tok(TokenKind.Colon), Parsec.alt(Parsec.tok(TokenKind.Parameter), Parsec.tok(TokenKind.Argument))), Parsec.tok(TokenKind.Space))


function parse(input: string) {
  return Parsec.expectSingleResult(
    Parsec.expectEOF(
      parser.parse(
        lexer.parse(input)
      )
    )
  )
}

(window as any).parse = parse
