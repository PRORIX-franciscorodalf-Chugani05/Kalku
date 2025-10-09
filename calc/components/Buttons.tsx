import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleProp, ViewStyle } from "react-native";
import { Styles } from "@/styles/GlobalStyles";
import { colorsPallette } from "@/styles/Colors";
import { ThemeContext } from "@/context/themeContext";

interface ButtonProps {
  label: string;
  type?: "num" | "op" | "equal" | "clear" | "result";
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({ label, type, onPress, style }) => {
  const theme = useContext(ThemeContext);

  const getBackgroundColor = (buttonType: string | undefined) => {
    switch (buttonType) {
      case "num":
        return theme === "light" ? colorsPallette.numLight : colorsPallette.numDark;
      case "op":
        return theme === "light" ? colorsPallette.opLight : colorsPallette.opDark;
      case "equal":
        return theme === "light" ? colorsPallette.equalLight : colorsPallette.equalDark;
      case "clear":
        return theme === "light" ? colorsPallette.clearLight : colorsPallette.clearDark;
      case "result":
        return theme === "light" ? colorsPallette.resultLight : colorsPallette.resultDark;
      default:
        return theme === "light" ? colorsPallette.bgLight : colorsPallette.bgDark;
    }
  };

  const textColor = theme === "light" ? colorsPallette.textLight : colorsPallette.textDark;

  return (
    <TouchableOpacity
      style={[Styles.btn, { backgroundColor: getBackgroundColor(type) }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[Styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
