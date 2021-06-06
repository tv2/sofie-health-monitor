export enum TokenKind {
  Colon,
  Key,
  Value,
  Operator,
  LParen,
  RParen,
  Space,
}

export type AbstractSyntaxTreeOption = {
  type: 'option',
  key: string,
  value: any,
}

export type AbstractSyntaxTreeOperator = {
  type: 'operator',
  key: string,
  left: AbstractSyntaxTree,
  right: AbstractSyntaxTree,
}

export type AbstractSyntaxTree = AbstractSyntaxTreeOption | AbstractSyntaxTreeOperator
