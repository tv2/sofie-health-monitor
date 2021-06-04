export enum TokenKind {
  Colon,
  Comma,
  Key,
  Value,
  Space,
  LParen,
  RParen,
}

export type AbstractSyntaxTreeOption = {
  type: 'option',
  key: string,
  value: any,
}

export type AbstractSyntaxTreeConditional = {
  type: 'conditional',
  key: string,
  left: AbstractSyntaxTree,
  right: AbstractSyntaxTree,
}

export type AbstractSyntaxTree = AbstractSyntaxTreeOption | AbstractSyntaxTreeConditional
