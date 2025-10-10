import { useCallback, useMemo, useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import Display from "@/components/calculator/Display";
import HistoryModal from "@/components/calculator/HistoryModal";
import Keypad from "@/components/calculator/Keypad";
import { ThemeContext } from "@/context/themeContext";
import { colorsPallette } from "@/styles/Colors";
import { Styles } from "@/styles/GlobalStyles";
import {
  CalculatorState,
  HistoryEntry,
  MAX_HISTORY_ITEMS,
  OperatorSymbol,
  Token,
} from "@/types/calculator";
import {
  appendImplicitMultiplication,
  countUnmatchedParens,
  evaluateExpression,
  exceedsMaxDigits,
  formatNumber,
  isNumberToken,
  isOperator,
  trimLastCharacter,
} from "@/utils/calculator";

const createInitialState = (): CalculatorState => ({
  tokens: [],
  currentValue: "0",
  valueEdited: false,
  isResultDisplayed: false,
  lastExpression: null,
});

export default function Index() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [calculatorState, setCalculatorState] = useState<CalculatorState>(createInitialState());
  const { tokens, currentValue, valueEdited, isResultDisplayed, lastExpression } = calculatorState;
  const isErrorValue = currentValue === "Error";
  const resetAfterResult = useCallback(() => {
    setCalculatorState((prev) => ({
      ...prev,
      tokens: [],
      isResultDisplayed: false,
      lastExpression: null,
    }));
  }, []);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  const isLightTheme = theme === "light";
  const themeColors = useMemo(
    () => ({
      background: isLightTheme ? colorsPallette.bgLight : colorsPallette.bgDark,
      screen: isLightTheme ? colorsPallette.screenLight : colorsPallette.screenDark,
      text: isLightTheme ? colorsPallette.textLight : colorsPallette.textDark,
    }),
    [isLightTheme],
  );
  const { background: backgroundColor, screen: screenColor, text: textColor } = themeColors;

  const handleClear = useCallback(() => {
    setCalculatorState(createInitialState());
  }, []);

  const handleBackspace = useCallback(() => {
    if (isErrorValue) {
      handleClear();
      return;
    }

    const applyTrimmedValue = () => {
      const nextValue = trimLastCharacter(currentValue);
      setCalculatorState((prev) => ({
        ...prev,
        currentValue: nextValue,
        valueEdited: nextValue !== "0",
      }));
    };

    if (isResultDisplayed) {
      resetAfterResult();
      applyTrimmedValue();
      return;
    }

    if (valueEdited) {
      applyTrimmedValue();
      return;
    }

    if (tokens.length === 0) {
      return;
    }

    const workingTokens = [...tokens];
    const removedToken = workingTokens.pop();
    if (!removedToken) {
      return;
    }

    if (isNumberToken(removedToken)) {
      setCalculatorState((prev) => ({
        ...prev,
        tokens: workingTokens,
        currentValue: removedToken,
        valueEdited: true,
      }));
      return;
    }

    const previousToken = workingTokens[workingTokens.length - 1];
    if (previousToken && isNumberToken(previousToken)) {
      workingTokens.pop();
      setCalculatorState((prev) => ({
        ...prev,
        tokens: workingTokens,
        currentValue: previousToken,
        valueEdited: true,
      }));
      return;
    }

    setCalculatorState((prev) => ({
      ...prev,
      tokens: workingTokens,
      currentValue: workingTokens.length === 0 ? "0" : prev.currentValue,
      valueEdited: workingTokens.length === 0 ? false : prev.valueEdited,
    }));
  }, [currentValue, handleClear, isErrorValue, isResultDisplayed, resetAfterResult, tokens, valueEdited]);

  const handleNumberPress = useCallback(
    (digit: string) => {
      if (isErrorValue) {
        if (exceedsMaxDigits(digit)) {
          return;
        }
        setCalculatorState({
          ...createInitialState(),
          currentValue: digit,
          valueEdited: true,
        });
        return;
      }

      if (isResultDisplayed) {
        if (exceedsMaxDigits(digit)) {
          return;
        }
        setCalculatorState({
          ...createInitialState(),
          currentValue: digit,
          valueEdited: true,
        });
        return;
      }

      const updatedTokens = appendImplicitMultiplication(tokens);

      let nextValue: string;
      if (!valueEdited && currentValue === "0") {
        nextValue = digit;
      } else if (currentValue === "-0") {
        nextValue = `-${digit}`;
      } else {
        nextValue = currentValue + digit;
      }

      if (exceedsMaxDigits(nextValue)) {
        return;
      }

      setCalculatorState((prev) => ({
        ...prev,
        tokens: updatedTokens !== tokens ? updatedTokens : prev.tokens,
        currentValue: nextValue,
        valueEdited: true,
      }));
    },
    [currentValue, isErrorValue, isResultDisplayed, tokens, valueEdited],
  );

  const handleDecimal = useCallback(() => {
    if (isErrorValue) {
      setCalculatorState({
        ...createInitialState(),
        currentValue: "0.",
        valueEdited: true,
      });
      return;
    }

    if (isResultDisplayed) {
      setCalculatorState({
        ...createInitialState(),
        currentValue: "0.",
        valueEdited: true,
      });
      return;
    }

    if (currentValue.includes(".")) {
      return;
    }

    const updatedTokens = appendImplicitMultiplication(tokens);

    const nextValue = !valueEdited ? "0." : `${currentValue}.`;
    if (exceedsMaxDigits(nextValue)) {
      return;
    }

    setCalculatorState((prev) => ({
      ...prev,
      tokens: updatedTokens !== tokens ? updatedTokens : prev.tokens,
      currentValue: nextValue,
      valueEdited: true,
    }));
  }, [currentValue, isErrorValue, isResultDisplayed, tokens, valueEdited]);

  const handleToggleSign = useCallback(() => {
    if (isErrorValue) {
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
    setCalculatorState((prev) => ({
      ...prev,
      currentValue: nextValue,
      valueEdited: true,
    }));
  }, [currentValue, isErrorValue, isResultDisplayed, resetAfterResult]);

  const handlePercent = useCallback(() => {
    if (isErrorValue) {
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
    setCalculatorState((prev) => ({
      ...prev,
      currentValue: percentage,
      valueEdited: true,
    }));
  }, [currentValue, isErrorValue, isResultDisplayed, resetAfterResult]);

  const handleOperatorPress = useCallback(
    (nextOperator: OperatorSymbol) => {
      if (isErrorValue) {
        return;
      }

      let workingTokens = isResultDisplayed ? [currentValue] : [...tokens];
      let localValueEdited = valueEdited;

      if (isResultDisplayed) {
        setCalculatorState((prev) => ({
          ...prev,
          isResultDisplayed: false,
          lastExpression: null,
        }));
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
          setCalculatorState((prev) => ({
            ...prev,
            tokens: workingTokens,
            currentValue: "0",
            valueEdited: false,
          }));
          return;
        }
      }

      const updatedLastToken = workingTokens[workingTokens.length - 1];
      if (isOperator(updatedLastToken)) {
        workingTokens[workingTokens.length - 1] = nextOperator;
      } else {
        workingTokens.push(nextOperator);
      }

      setCalculatorState((prev) => ({
        ...prev,
        tokens: workingTokens,
        currentValue: "0",
        valueEdited: false,
      }));
    },
    [currentValue, isErrorValue, isResultDisplayed, tokens, valueEdited],
  );

  const handleEquals = useCallback(() => {
    if (isErrorValue || isResultDisplayed) {
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

    setCalculatorState((prev) => ({
      ...prev,
      tokens: [],
      currentValue: result === "Error" ? "Error" : result,
      valueEdited: false,
      isResultDisplayed: true,
      lastExpression: expressionText,
    }));

    if (result !== "Error") {
      setHistory((prev) => {
        const next = [{ expression: expressionText, result }, ...prev];
        return next.slice(0, MAX_HISTORY_ITEMS);
      });
    }
  }, [currentValue, isErrorValue, isResultDisplayed, tokens, valueEdited]);

  const handleHistorySelect = useCallback((item: HistoryEntry) => {
    setHistoryVisible(false);
    setCalculatorState((prev) => ({
      ...prev,
      tokens: [],
      currentValue: item.result,
      valueEdited: false,
      isResultDisplayed: true,
      lastExpression: item.expression,
    }));
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
    if (isErrorValue) {
      return;
    }

    const wasResultDisplayed = isResultDisplayed;
    let workingTokens = wasResultDisplayed ? [] : [...tokens];
    const balance = countUnmatchedParens(workingTokens);
    const lastToken = workingTokens[workingTokens.length - 1];
    const localValueEdited = wasResultDisplayed ? false : valueEdited;
    const shouldClose =
      balance > 0 && (localValueEdited || lastToken === ")" || (lastToken && isNumberToken(lastToken)));

    const commitState = (updatedTokens: Token[]) => {
      setCalculatorState((prev) => ({
        ...prev,
        tokens: updatedTokens,
        currentValue: "0",
        valueEdited: false,
        isResultDisplayed: false,
        lastExpression: wasResultDisplayed ? null : prev.lastExpression,
      }));
    };

    if (shouldClose) {
      if (localValueEdited) {
        workingTokens.push(currentValue);
      }

      const updatedLast = workingTokens[workingTokens.length - 1];
      if (isOperator(updatedLast) || updatedLast === "(") {
        return;
      }

      workingTokens.push(")");
      commitState(workingTokens);
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
    commitState(workingTokens);
  }, [currentValue, isErrorValue, isResultDisplayed, tokens, valueEdited]);

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

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleDeleteHistory = useCallback((index: number) => {
    setHistory((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  }, []);

  const expressionLabel = expressionDisplay || "\u00A0";
  const separatorColor = useMemo(
    () => (isLightTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)"),
    [isLightTheme],
  );

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaView style={[Styles.safeArea, { backgroundColor }]} edges={["top", "bottom"]}>
        <View style={[Styles.container, { backgroundColor }]}>
          <StatusBar style={isLightTheme ? "dark" : "light"} />

          <Display expression={expressionLabel} value={currentValue} screenColor={screenColor} textColor={textColor} />

          <View style={Styles.controlBar}>
            <Switch value={isLightTheme} onValueChange={(value) => setTheme(value ? "light" : "dark")} />
            <TouchableOpacity
              style={[Styles.historyButton, { borderColor: textColor }]}
              onPress={() => setHistoryVisible(true)}
            >
              <Text style={[Styles.historyButtonText, { color: textColor }]}>Historial</Text>
            </TouchableOpacity>
          </View>

          <View style={[Styles.separator, { backgroundColor: separatorColor }]} />

          <Keypad
            onClear={handleClear}
            onParenthesis={handleParenthesis}
            onNumberPress={handleNumberPress}
            onDecimal={handleDecimal}
            onToggleSign={handleToggleSign}
            onPercent={handlePercent}
            onOperatorPress={handleOperatorPress}
            onEquals={handleEquals}
            onBackspace={handleBackspace}
            parenthesisLabel={parenthesisButtonLabel}
          />

          <HistoryModal
            visible={historyVisible}
            history={history}
            onClose={() => setHistoryVisible(false)}
            onSelect={handleHistorySelect}
            onDelete={handleDeleteHistory}
            onClear={handleClearHistory}
            textColor={textColor}
            screenColor={screenColor}
            isLightTheme={isLightTheme}
          />
        </View>
      </SafeAreaView>
    </ThemeContext.Provider>
  );
}
