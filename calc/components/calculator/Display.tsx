import { memo } from "react";
import { Text, View } from "react-native";

import { Styles } from "@/styles/GlobalStyles";

type DisplayProps = {
  expression: string;
  value: string;
  screenColor: string;
  textColor: string;
};

const Display = ({ expression, value, screenColor, textColor }: DisplayProps) => (
  <View style={[Styles.screen, { backgroundColor: screenColor }]}>
    <Text
      style={[Styles.expressionText, { color: textColor }]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.5}
    >
      {expression}
    </Text>
    <Text
      style={[Styles.resultText, { color: textColor }]}
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.3}
    >
      {value}
    </Text>
  </View>
);

export default memo(Display);
