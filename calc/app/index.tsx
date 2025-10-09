import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  Modal,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "@/components/Buttons";
import { Styles } from "@/styles/GlobalStyles";
import { colorsPallette } from "@/styles/Colors";
import { ThemeContext } from "@/context/themeContext";

type OperatorSymbol = "/" | "*" | "-" | "+";

type HistoryEntry = {
  expression: string;
  result: string;
};

type Token = string;

const MAX_HISTORY_ITEMS = 20;
const MAX_DIGITS = 11;

const operatorPrecedence: Record<OperatorSymbol, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

const isOperator = (token: Token): token is OperatorSymbol =>
  token === "+" || token === "-" || token === "*" || token === "/";

const isNumberToken = (token: Token) => !isOperator(token) && token !== "(" && token !== ")";

const countUnmatchedParens = (tokens: Token[]) => {
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

const countDigits = (value: string) => {
  const [base] = value.split(/[eE]/);
  return base.replace(/[^0-9]/g, "").length;
};

const formatNumber = (value: number) => {
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

const toPostfix = (inputTokens: Token[]): Token[] | null => {
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

const evaluatePostfix = (postfixTokens: Token[]): number | null => {
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

const evaluateExpression = (tokens: Token[]): string => {
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

export default function Index() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentValue, setCurrentValue] = useState("0");
  const [valueEdited, setValueEdited] = useState(false);
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);
  const [lastExpression, setLastExpression] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  const isLightTheme = theme === "light";
  const backgroundColor = isLightTheme ? colorsPallette.bgLight : colorsPallette.bgDark;
  const screenColor = isLightTheme ? colorsPallette.screenLight : colorsPallette.screenDark;
  const textColor = isLightTheme ? colorsPallette.textLight : colorsPallette.textDark;

  const resetAfterResult = useCallback(() => {
    setTokens([]);
    setIsResultDisplayed(false);
    setLastExpression(null);
  }, []);

  const addToHistory = useCallback((entry: HistoryEntry) => {
    setHistory((prev) => {
      const next = [entry, ...prev];
      return next.slice(0, MAX_HISTORY_ITEMS);
    });
  }, []);

  const handleClear = useCallback(() => {
    setTokens([]);
    setCurrentValue("0");
    setValueEdited(false);
    setIsResultDisplayed(false);
    setLastExpression(null);
  }, []);

  const handleNumberPress = useCallback(
    (digit: string) => {
      if (currentValue === "Error") {
        if (countDigits(digit) > MAX_DIGITS) {
          return;
        }
        setCurrentValue(digit);
        setTokens([]);
        setValueEdited(true);
        setIsResultDisplayed(false);
        setLastExpression(null);
        return;
      }

      if (isResultDisplayed) {
        if (countDigits(digit) > MAX_DIGITS) {
          return;
        }
        resetAfterResult();
        setCurrentValue(digit);
        setValueEdited(true);
        return;
      }

      let updatedTokens = tokens;
      const lastToken = tokens[tokens.length - 1];
      if (lastToken === ")") {
        updatedTokens = [...tokens, "*"];
      }

      let nextValue: string;
      if (!valueEdited && currentValue === "0") {
        nextValue = digit;
      } else if (currentValue === "-0") {
        nextValue = `-${digit}`;
      } else {
        nextValue = currentValue + digit;
      }

      if (countDigits(nextValue) > MAX_DIGITS) {
        return;
      }

      if (updatedTokens !== tokens) {
        setTokens(updatedTokens);
      }
      setCurrentValue(nextValue);
      setValueEdited(true);
    },
    [currentValue, isResultDisplayed, resetAfterResult, tokens, valueEdited],
  );

  const handleDecimal = useCallback(() => {
    if (currentValue === "Error") {
      setCurrentValue("0.");
      setTokens([]);
      setValueEdited(true);
      setIsResultDisplayed(false);
      setLastExpression(null);
      return;
    }

    if (isResultDisplayed) {
      resetAfterResult();
      setCurrentValue("0.");
      setValueEdited(true);
      return;
    }

    if (currentValue.includes(".")) {
      return;
    }

    let updatedTokens = tokens;
    const lastToken = tokens[tokens.length - 1];
    if (lastToken === ")") {
      updatedTokens = [...tokens, "*"];
    }

    const nextValue = !valueEdited ? "0." : `${currentValue}.`;
    if (countDigits(nextValue) > MAX_DIGITS) {
      return;
    }

    if (updatedTokens !== tokens) {
      setTokens(updatedTokens);
    }

    setCurrentValue(nextValue);
    setValueEdited(true);
  }, [currentValue, isResultDisplayed, resetAfterResult, tokens, valueEdited]);

  const handleToggleSign = useCallback(() => {
    if (currentValue === "Error") {
      return;
    }

    if (isResultDisplayed) {
      resetAfterResult();
    }

    const nextValue = currentValue.startsWith("-")
      ? currentValue.slice(1) || "0"
      : currentValue === "0"
        ? "-0"
        : `-${currentValue}`;
    setCurrentValue(nextValue);
    setValueEdited(true);
  }, [currentValue, isResultDisplayed, resetAfterResult]);

  const handlePercent = useCallback(() => {
    if (currentValue === "Error") {
      return;
    }

    const numeric = Number(currentValue);
    if (!Number.isFinite(numeric)) {
      return;
    }

    if (isResultDisplayed) {
      resetAfterResult();
    }

    const percentage = formatNumber(numeric / 100);
    setCurrentValue(percentage);
    setValueEdited(true);
  }, [currentValue, isResultDisplayed, resetAfterResult]);

  const handleOperatorPress = useCallback(
    (nextOperator: OperatorSymbol) => {
      if (currentValue === "Error") {
        return;
      }

      let workingTokens = isResultDisplayed ? [currentValue] : [...tokens];
      let localValueEdited = valueEdited;

      if (isResultDisplayed) {
        setIsResultDisplayed(false);
        setLastExpression(null);
      }

      if (localValueEdited) {
        workingTokens.push(currentValue);
        localValueEdited = false;
      }

      const lastToken = workingTokens[workingTokens.length - 1];

      if (!localValueEdited && !isResultDisplayed) {
        if (!lastToken) {
          workingTokens.push("0");
        } else if (lastToken === "(") {
          return;
        } else if (isOperator(lastToken)) {
          workingTokens[workingTokens.length - 1] = nextOperator;
          setTokens(workingTokens);
          setCurrentValue("0");
          setValueEdited(false);
          return;
        }
      }

      const updatedLastToken = workingTokens[workingTokens.length - 1];
      if (isOperator(updatedLastToken)) {
        workingTokens[workingTokens.length - 1] = nextOperator;
      } else {
        workingTokens.push(nextOperator);
      }

      setTokens(workingTokens);
      setCurrentValue("0");
      setValueEdited(false);
    },
    [currentValue, isResultDisplayed, tokens, valueEdited],
  );

  const handleEquals = useCallback(() => {
    if (currentValue === "Error" || isResultDisplayed) {
      return;
    }

    let workingTokens = [...tokens];

    if (valueEdited) {
      workingTokens.push(currentValue);
    }

    if (workingTokens.length === 0) {
      return;
    }

    const lastToken = workingTokens[workingTokens.length - 1];
      if (isOperator(lastToken) || lastToken === "(") {
        return;
      }

    const unmatched = countUnmatchedParens(workingTokens);
    if (unmatched !== 0) {
      return;
    }

    const expressionText = workingTokens.join(" ");
    const result = evaluateExpression(workingTokens);

    setLastExpression(expressionText);

    if (result === "Error") {
      setCurrentValue("Error");
    } else {
      setCurrentValue(result);
      addToHistory({ expression: expressionText, result });
    }

    setTokens([]);
    setValueEdited(false);
    setIsResultDisplayed(true);
  }, [currentValue, isResultDisplayed, addToHistory, tokens, valueEdited]);

  const handleHistorySelect = useCallback((item: HistoryEntry) => {
    setHistoryVisible(false);
    setTokens([]);
    setCurrentValue(item.result);
    setValueEdited(false);
    setIsResultDisplayed(true);
    setLastExpression(item.expression);
  }, []);

  const parenthesisButtonLabel = useMemo(() => {
    if (isResultDisplayed) {
      return "(";
    }

    const balance = countUnmatchedParens(tokens);
    const lastToken = tokens[tokens.length - 1];
    if (
      balance > 0 &&
      (valueEdited || lastToken === ")" || (lastToken && isNumberToken(lastToken)))
    ) {
      return ")";
    }

    return "(";
  }, [isResultDisplayed, tokens, valueEdited]);

  const handleParenthesis = useCallback(() => {
    if (currentValue === "Error") {
      return;
    }

    let workingTokens = isResultDisplayed ? [] : [...tokens];

    if (isResultDisplayed) {
      resetAfterResult();
      setCurrentValue("0");
      setValueEdited(false);
    }

    const balance = countUnmatchedParens(workingTokens);
    const lastToken = workingTokens[workingTokens.length - 1];
    const shouldClose =
      balance > 0 && (valueEdited || lastToken === ")" || (lastToken && isNumberToken(lastToken)));

    if (shouldClose) {
      if (valueEdited) {
        workingTokens.push(currentValue);
      }

      const updatedLast = workingTokens[workingTokens.length - 1];
      if (isOperator(updatedLast) || updatedLast === "(") {
        return;
      }

      workingTokens.push(")");
      setTokens(workingTokens);
      setCurrentValue("0");
      setValueEdited(false);
      return;
    }

    const canOpen =
      workingTokens.length === 0 ||
      lastToken === "(" ||
      isOperator(lastToken) ||
      lastToken === undefined;

    if (!canOpen) {
      if (lastToken === ")" || (lastToken && isNumberToken(lastToken))) {
        workingTokens.push("*");
      } else {
        return;
      }
    }

    workingTokens.push("(");
    setTokens(workingTokens);
    setCurrentValue("0");
    setValueEdited(false);
  }, [currentValue, isResultDisplayed, resetAfterResult, tokens, valueEdited]);

  const expressionDisplay = useMemo(() => {
    if (isResultDisplayed && lastExpression) {
      return `${lastExpression} =`;
    }

    if (tokens.length === 0 && !valueEdited) {
      return "";
    }

    const displayTokens = [...tokens];

    if (valueEdited && currentValue !== "Error") {
      displayTokens.push(currentValue);
    } else {
      const lastToken = tokens[tokens.length - 1];
      if (isOperator(lastToken) || lastToken === "(") {
        displayTokens.push(currentValue);
      }
    }

    return displayTokens.join(" ");
  }, [currentValue, isResultDisplayed, lastExpression, tokens, valueEdited]);

  const handleDeleteHistory = useCallback((index: number) => {
    setHistory((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const renderHistoryItem = useCallback<ListRenderItem<HistoryEntry>>(
    ({ item, index }) => (
      <TouchableOpacity
        style={[
          Styles.historyItem,
          { borderBottomColor: isLightTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" },
        ]}
        onPress={() => handleHistorySelect(item)}
      >
        <View style={Styles.historyItemText}>
          <Text
            style={[Styles.historyExpression, { color: textColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {item.expression} =
          </Text>
          <Text
            style={[Styles.historyResult, { color: textColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
          >
            {item.result}
          </Text>
        </View>
        <TouchableOpacity
          style={[Styles.historyDeleteButton, { borderColor: textColor }]}
          onPress={(event: GestureResponderEvent) => {
            event.stopPropagation();
            handleDeleteHistory(index);
          }}
        >
          <Text style={[Styles.historyDeleteText, { color: textColor }]}>Borrar</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [handleDeleteHistory, handleHistorySelect, isLightTheme, textColor],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <View style={[Styles.container, { backgroundColor }]}>
        <StatusBar style={isLightTheme ? "dark" : "light"} />

        <View style={[Styles.screen, { backgroundColor: screenColor }]}>
          {expressionDisplay ? (
            <Text
              style={[Styles.expressionText, { color: textColor }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
            >
              {expressionDisplay}
            </Text>
          ) : null}
          <Text
            style={[Styles.resultText, { color: textColor }]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.3}
          >
            {currentValue}
          </Text>
        </View>

        <View style={Styles.controlBar}>
          <Switch value={isLightTheme} onValueChange={(value) => setTheme(value ? "light" : "dark")} />
          <TouchableOpacity
            style={[Styles.historyButton, { borderColor: textColor }]}
            onPress={() => setHistoryVisible(true)}
          >
            <Text style={[Styles.historyButtonText, { color: textColor }]}>Historial</Text>
          </TouchableOpacity>
        </View>

        <View style={[Styles.separator, { backgroundColor: isLightTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" }]} />

        <View style={Styles.keypad}>
          <View style={Styles.row}>
            <Button label="C" type="clear" onPress={handleClear} />
            <Button label={parenthesisButtonLabel} type="op" onPress={handleParenthesis} />
            <Button label="+/-" type="op" onPress={handleToggleSign} />
            <Button label="%" type="op" onPress={handlePercent} />
            <Button label="/" type="op" onPress={() => handleOperatorPress("/")} />
          </View>
          <View style={Styles.row}>
            <Button label="7" type="num" onPress={() => handleNumberPress("7")} />
            <Button label="8" type="num" onPress={() => handleNumberPress("8")} />
            <Button label="9" type="num" onPress={() => handleNumberPress("9")} />
            <Button label="*" type="op" onPress={() => handleOperatorPress("*")} />
          </View>
          <View style={Styles.row}>
            <Button label="4" type="num" onPress={() => handleNumberPress("4")} />
            <Button label="5" type="num" onPress={() => handleNumberPress("5")} />
            <Button label="6" type="num" onPress={() => handleNumberPress("6")} />
            <Button label="-" type="op" onPress={() => handleOperatorPress("-")} />
          </View>
          <View style={Styles.row}>
            <Button label="1" type="num" onPress={() => handleNumberPress("1")} />
            <Button label="2" type="num" onPress={() => handleNumberPress("2")} />
            <Button label="3" type="num" onPress={() => handleNumberPress("3")} />
            <Button label="+" type="op" onPress={() => handleOperatorPress("+")} />
          </View>
          <View style={Styles.row}>
            <Button label="0" type="num" style={Styles.zeroButton} onPress={() => handleNumberPress("0")} />
            <Button label="." type="num" onPress={handleDecimal} />
            <Button label="=" type="equal" onPress={handleEquals} />
          </View>
        </View>

        <Modal
          transparent
          animationType="slide"
          visible={historyVisible}
          onRequestClose={() => setHistoryVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setHistoryVisible(false)}>
            <View style={Styles.historyModalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[Styles.historyPanel, { backgroundColor: screenColor }]}>
                  <View style={Styles.historyHeader}>
                    <Text style={[Styles.historyTitle, { color: textColor }]}>Historial</Text>
                    <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                      <Text style={[Styles.historyButtonText, { color: textColor }]}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={history}
                    keyExtractor={(item, index) => `${item.expression}-${index}`}
                    renderItem={renderHistoryItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                      history.length === 0 ? { flexGrow: 1, justifyContent: "center" } : undefined
                    }
                    ListEmptyComponent={
                      <Text style={[Styles.historyEmpty, { color: textColor }]}>Sin cálculos guardados</Text>
                    }
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ThemeContext.Provider>
  );
}
