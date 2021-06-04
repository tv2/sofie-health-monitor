import { buildLexer } from 'typescript-parsec'

import { TokenKind } from './tokens'

export const lexit = buildLexer([
  [true, /^:/g, TokenKind.Colon],
  [true, /^,/g, TokenKind.Comma],
  [true, /^(?:is|has|not|n|name)(?=\s*:)/g, TokenKind.Key],
  [true, /^[a-zA-Z_0-9-]+/g, TokenKind.Value],
  [true, /^\(/g, TokenKind.LParen],
  [true, /^\)/g, TokenKind.RParen],
  [false, /^\s+/g, TokenKind.Space]
])

