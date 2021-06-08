import { buildLexer } from 'typescript-parsec'

import { TokenKind } from './tokens'

export const lexit = buildLexer([
  [true, /^:/g, TokenKind.Colon],
  [true, /^(?:and|or|!)/g, TokenKind.Operator],
  [true, /^(?:n(?:ame)?|s(?:tatus)?|r(?:undown)?|is)(?=\s*:)/g, TokenKind.Key],
  [true, /^(?:[a-zA-Z_0-9-]+|"(?:[^"\\]|\\.)*")(?!\s*:)/g, TokenKind.Value],
  [true, /^\(/g, TokenKind.LParen],
  [true, /^\)/g, TokenKind.RParen],
  [false, /^\s+/g, TokenKind.Space]
])

