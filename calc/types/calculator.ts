export type OperatorSymbol = "/" | "*" | "-" | "+";

export type Token = string;

export type HistoryEntry = {
  expression: string;
  result: string;
};

export type CalculatorState = {
  tokens: Token[];
  currentValue: string;
  valueEdited: boolean;
  isResultDisplayed: boolean;
  lastExpression: string | null;
};

export const MAX_HISTORY_ITEMS = 20;
export const MAX_DIGITS = 11;
