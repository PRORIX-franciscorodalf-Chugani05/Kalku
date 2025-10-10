import { memo } from "react";
import { View } from "react-native";

import Button from "@/components/Buttons";
import { Styles } from "@/styles/GlobalStyles";
import { OperatorSymbol } from "@/types/calculator";

type KeypadProps = {
  onClear: () => void;
  onParenthesis: () => void;
  onNumberPress: (digit: string) => void;
  onDecimal: () => void;
  onToggleSign: () => void;
  onPercent: () => void;
  onOperatorPress: (operator: OperatorSymbol) => void;
  onEquals: () => void;
  onBackspace: () => void;
  parenthesisLabel: string;
};

const Keypad = ({
  onClear,
  onParenthesis,
  onNumberPress,
  onDecimal,
  onToggleSign,
  onPercent,
  onOperatorPress,
  onEquals,
  onBackspace,
  parenthesisLabel,
}: KeypadProps) => (
  <View style={Styles.keypad}>
    <View style={Styles.row}>
      <Button label="C" type="clear" onPress={onClear} />
      <Button label={parenthesisLabel} type="op" onPress={onParenthesis} />
      <Button label="+/-" type="op" onPress={onToggleSign} />
      <Button label="%" type="op" onPress={onPercent} />
      <Button label="/" type="op" onPress={() => onOperatorPress("/")} />
    </View>
    <View style={Styles.row}>
      <Button label="1" type="num" onPress={() => onNumberPress("1")} />
      <Button label="2" type="num" onPress={() => onNumberPress("2")} />
      <Button label="3" type="num" onPress={() => onNumberPress("3")} />
      <Button label="*" type="op" onPress={() => onOperatorPress("*")} />
    </View>
    <View style={Styles.row}>
      <Button label="4" type="num" onPress={() => onNumberPress("4")} />
      <Button label="5" type="num" onPress={() => onNumberPress("5")} />
      <Button label="6" type="num" onPress={() => onNumberPress("6")} />
      <Button label="-" type="op" onPress={() => onOperatorPress("-")} />
    </View>
    <View style={Styles.row}>
      <Button label="7" type="num" onPress={() => onNumberPress("7")} />
      <Button label="8" type="num" onPress={() => onNumberPress("8")} />
      <Button label="9" type="num" onPress={() => onNumberPress("9")} />
      <Button label="+" type="op" onPress={() => onOperatorPress("+")} />
    </View>
    <View style={Styles.row}>
      <Button label="0" type="num" style={Styles.zeroButton} onPress={() => onNumberPress("0")} />
      <Button label="." type="num" onPress={onDecimal} />
      <Button label="DEL" type="clear" onPress={onBackspace} />
      <Button label="=" type="equal" onPress={onEquals} />
    </View>
  </View>
);

export default memo(Keypad);
