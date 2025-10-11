import { MAX_DIGITS, OperatorSymbol, Token } from "../types/calculator";

const operatorPrecedence: Record<OperatorSymbol, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

export const isOperator = (token: Token): token is OperatorSymbol =>
  token === "+" || token === "-" || token === "*" || token === "/";

export const isNumberToken = (token: Token) => !isOperator(token) && token !== "(" && token !== ")";

export const countUnmatchedParens = (tokens: Token[]) => {
  let balance = 0;
  for (const token of tokens) {
    if (token === "(") {
      balance += 1;
    } else if (token === ")") {
      balance -= 1;
      if (balance < 0) {
        return -1;
      }
    }
  }
  return balance;
};

export const countDigits = (value: string) => {
  const [base] = value.split(/[eE]/);
  return base.replace(/[^0-9]/g, "").length;
};

export const trimLastCharacter = (value: string) => {
  if (value.length <= 1) {
    return "0";
  }

  const trimmed = value.slice(0, -1);
  if (!trimmed || trimmed === "-" || trimmed === "-0") {
    return "0";
  }

  return trimmed;
};

export const appendImplicitMultiplication = (existingTokens: Token[]) => {
  const lastToken = existingTokens[existingTokens.length - 1];
  return lastToken === ")" ? [...existingTokens, "*"] : existingTokens;
};

export const exceedsMaxDigits = (value: string) => countDigits(value) > MAX_DIGITS;

export const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }
  let result = value.toPrecision(MAX_DIGITS);

  if (result.includes("e")) {
    const [mantissa, exponent = ""] = result.split("e");
    const trimmedMantissa = mantissa
      .replace(/(\.\d*?[1-9])0+$/, "$1")
      .replace(/\.0+$/, "");
    result = `${trimmedMantissa}${exponent ? `e${exponent}` : ""}`;
  } else {
    result = result.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "");
  }

  if (result === "-0") {
    return "0";
  }

  if (countDigits(result) > MAX_DIGITS) {
    const exponential = value.toExponential(MAX_DIGITS - 1);
    return exponential;
  }

  return result;
};

export const toPostfix = (inputTokens: Token[]): Token[] | null => {
  const output: Token[] = [];
  const stack: Token[] = [];

  for (const token of inputTokens) {
    if (isNumberToken(token)) {
      output.push(token);
      continue;
    }

    if (isOperator(token)) {
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (isOperator(top) && operatorPrecedence[top] >= operatorPrecedence[token]) {
          output.push(stack.pop() as Token);
        } else {
          break;
        }
      }
      stack.push(token);
      continue;
    }

    if (token === "(") {
      stack.push(token);
      continue;
    }

    if (token === ")") {
      let foundOpening = false;
      while (stack.length > 0) {
        const top = stack.pop() as Token;
        if (top === "(") {
          foundOpening = true;
          break;
        }
        output.push(top);
      }
      if (!foundOpening) {
        return null;
      }
      continue;
    }

    return null;
  }

  while (stack.length > 0) {
    const top = stack.pop() as Token;
    if (top === "(" || top === ")") {
      return null;
    }
    output.push(top);
  }

  return output;
};

export const evaluatePostfix = (postfixTokens: Token[]): number | null => {
  const stack: number[] = [];

  for (const token of postfixTokens) {
    if (isOperator(token)) {
      if (stack.length < 2) {
        return null;
      }
      const b = stack.pop() as number;
      const a = stack.pop() as number;

      let result: number;
      switch (token) {
        case "/":
          if (b === 0) {
            return null;
          }
          result = a / b;
          break;
        case "*":
          result = a * b;
          break;
        case "-":
          result = a - b;
          break;
        case "+":
          result = a + b;
          break;
        default:
          return null;
      }

      if (!Number.isFinite(result)) {
        return null;
      }

      stack.push(result);
      continue;
    }

    const numeric = Number(token);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    stack.push(numeric);
  }

  if (stack.length !== 1) {
    return null;
  }

  return stack[0];
};

export const evaluateExpression = (tokens: Token[]): string => {
  if (tokens.length === 0) {
    return "0";
  }

  const unmatched = countUnmatchedParens(tokens);
  if (unmatched !== 0) {
    return "Error";
  }

  const postfix = toPostfix(tokens);
  if (!postfix) {
    return "Error";
  }

  const result = evaluatePostfix(postfix);
  if (result === null) {
    return "Error";
  }

  return formatNumber(result);
};
