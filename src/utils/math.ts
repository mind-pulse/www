import { isType } from ".";

export const sum = (values: number[]): number =>
  values.reduce((total, current) => total + current, 0);

const integer = (value: number, rule?: Integer): number => {
  if (!rule) return value;

  switch (rule) {
    case "CEIL":
      return Math.ceil(value);
    case "ROUND":
      return Math.round(value);
    case "FLOOR":
      return Math.floor(value);
  }
};

export const calculate = (
  values: number[],
  formula_mode?: FormulaMode,
): number => {
  const n = sum(values);

  if (!formula_mode) {
    return n;
  }

  if (isType<{ multiply: number }>("multiply", formula_mode.operational_rule)) {
    return integer(
      n * formula_mode.operational_rule.multiply,
      formula_mode.integer,
    );
  }

  return integer(
    n / formula_mode.operational_rule.divide,
    formula_mode.integer,
  );
};

export const roundToDecimalPlaces = (
  number: number,
  decimalPlaces = 2,
): number => {
  if (number === 0) {
    return 0;
  }

  const multiplier = 10 ** decimalPlaces;
  const rounded = Math.round(number * multiplier);
  const result = rounded / multiplier;

  return result;
};

export const max = <T extends Record<K, number>, K extends keyof T>(
  arr: T[],
  property: K,
): T | null => {
  if (arr.length === 0) {
    return null;
  }

  return arr.reduce(
    (acc, current) => (current[property] > acc[property] ? current : acc),
    arr[0],
  );
};

export const maxIndex = <T extends Record<K, number>, K extends keyof T>(
  array: T[],
  property: K,
): number => {
  return array.reduce((i, currentObj, currentIndex, arr) => {
    if (currentObj[property] > arr[i][property]) {
      return currentIndex; // 更新最大值的索引
    }
    return i;
  }, 0);
};

export function getMaxIndexes<T extends Record<K, number>, K extends keyof T>(
  objects: T[],
  property: K,
): number[];
export function getMaxIndexes<
  T extends Record<K, Record<CK, number>>,
  K extends keyof T,
  CK extends keyof T[K],
>(objects: T[], property: K, childProperty?: CK): number[];
export function getMaxIndexes<
  T extends Record<K, Record<CK, number> | number>,
  K extends keyof T,
  CK extends keyof T[K],
>(objects: T[], property: K, childProperty?: CK): number[] {
  if (objects.length === 0) {
    return [];
  }

  const indexes: number[] = [];

  if (childProperty) {
    const maxValue = Math.max(
      ...objects.map(
        (obj) => (obj[property] as Record<CK, number>)[childProperty],
      ),
    );

    for (let i = 0; i < objects.length; i++) {
      if (objects[i][property][childProperty] === maxValue) {
        indexes.push(i);
      }
    }
  } else {
    const maxValue = Math.max(...objects.map((obj) => obj[property] as number));

    for (let i = 0; i < objects.length; i++) {
      if (objects[i][property] === maxValue) {
        indexes.push(i);
      }
    }
  }

  return indexes;
}

export function getMinIndexes<T extends Record<K, number>, K extends keyof T>(
  objects: T[],
  property: K,
): number[];
export function getMinIndexes<
  T extends Record<K, Record<CK, number>>,
  K extends keyof T,
  CK extends keyof T[K],
>(objects: T[], property: K, childProperty?: CK): number[];
export function getMinIndexes<
  T extends Record<K, Record<CK, number>>,
  K extends keyof T,
  CK extends keyof T[K],
>(arr: T[], property: K, childProperty?: CK): number[] {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }

  let minValue = childProperty
    ? arr[0][property][childProperty]
    : arr[0][property];
  let minIndexes: number[] = [0];

  for (let i = 1; i < arr.length; i++) {
    const currentValue = childProperty
      ? arr[i][property][childProperty]
      : arr[i][property];

    if (currentValue < minValue) {
      minValue = currentValue;
      minIndexes = [i];
    } else if (currentValue === minValue) {
      minIndexes.push(i);
    }
  }

  return minIndexes;
}

/**
 * 通过简单表达式和参数计算结果。
 *
 * 小程序不能使用 `eval` 和 `new Function`，只能自己实现简单表达式解析。
 * */
export class ExpressionCalculator {
  private operators = ["+", "-", "*", "/"];
  private operatorPrecedence = { "+": 1, "-": 1, "*": 2, "/": 2 };

  private variables: Record<string, number>;
  private formula: string;

  constructor(formula: string, variables: Record<string, number>) {
    this.validateVariables(formula, variables);

    this.variables = variables;
    this.formula = formula;
  }

  private validateVariables(
    formula: string,
    variables: Record<string, number>,
  ): void {
    const variableNames = Object.keys(variables);

    // 使用正则表达式匹配 formula 中的变量名
    const variablePattern = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const formulaVariables = Array.from(
      new Set(formula.match(variablePattern) || []),
    );

    // 检查 formula 中的每个变量是否都在 variables 中存在
    for (const formulaVariable of formulaVariables) {
      if (!variableNames.includes(formulaVariable)) {
        throw new Error(
          `Variable "${formulaVariable}" is missing in the provided variables.`,
        );
      }
    }
  }

  private tokenize(formula: string): (string | number)[] {
    const tokens: (string | number)[] = [];
    let currentToken = "";

    for (let i = 0; i < formula.length; i++) {
      const char = formula[i];

      if (this.operators.includes(char) || char === "(" || char === ")") {
        if (currentToken !== "") {
          if (!Number.isNaN(Number.parseFloat(currentToken))) {
            tokens.push(Number.parseFloat(currentToken));
          } else {
            tokens.push(currentToken); // Preserve variable names
          }
          currentToken = "";
        }
        tokens.push(char);
      } else if (char !== " ") {
        currentToken += char;
      }
    }

    if (currentToken !== "") {
      if (!Number.isNaN(Number.parseFloat(currentToken))) {
        tokens.push(Number.parseFloat(currentToken));
      } else {
        tokens.push(currentToken); // Preserve variable names
      }
    }

    return tokens;
  }

  private shuntingYard(tokens: (string | number)[]): (string | number)[] {
    const outputQueue: (string | number)[] = [];
    const operatorStack: string[] = [];

    for (const token of tokens) {
      if (typeof token === "number") {
        outputQueue.push(token);
      } else if (this.operators.includes(token)) {
        while (
          operatorStack.length > 0 &&
          this.operators.includes(operatorStack[operatorStack.length - 1]) &&
          this.operatorPrecedence[
            token as keyof typeof this.operatorPrecedence
          ] <=
            this.operatorPrecedence[
              operatorStack[
                operatorStack.length - 1
              ] as keyof typeof this.operatorPrecedence
            ]
        ) {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token === "(") {
        operatorStack.push(token);
      } else if (token === ")") {
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.pop(); // Pop the '('
      } else if (token in this.variables) {
        outputQueue.push(token);
      }
    }

    while (operatorStack.length > 0) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      outputQueue.push(operatorStack.pop()!);
    }

    return outputQueue;
  }

  private evaluateRPN(rpn: (string | number)[]): number {
    const stack: number[] = [];

    for (const token of rpn) {
      if (typeof token === "number") {
        stack.push(token);
      } else if (token in this.variables) {
        stack.push(this.variables[token]);
      } else {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const b = stack.pop()!;
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const a = stack.pop()!;

        switch (token) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
        }
      }
    }

    return stack[0];
  }

  calculate(): number {
    const tokens = this.tokenize(this.formula);
    const rpn = this.shuntingYard(tokens);
    const result = this.evaluateRPN(rpn);

    return result;
  }
}

type ComparisonOperatorFunction = (a: number, b: number) => boolean;
const comparisonOperators: Record<
  ComparisonOperator,
  ComparisonOperatorFunction
> = {
  L: (a, b) => a < b,
  LE: (a, b) => a <= b,
  G: (a, b) => a > b,
  GE: (a, b) => a >= b,
};

export const compare = (
  value: number,
  ...args: (ComparisonArg | null)[]
): boolean => {
  for (const arg of args) {
    if (!arg) continue;

    if (!comparisonOperators[arg.operator](value, arg.value)) {
      return false;
    }
  }

  return true;
};
