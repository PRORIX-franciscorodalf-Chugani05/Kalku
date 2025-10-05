import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { colorsPallette } from '@/styles/Colors';
import { ThemeContext } from '@/context/themeContext';
import { StyleSheet, Switch, View } from "react-native";
import Button from '@/components/Buttons';

export default function Index() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <View style={theme === 'light' ? style.container : [style.container, {backgroundColor: colorsPallette.bgDark}]}>
        <StatusBar style="auto" />
        <Switch
          value={theme === 'light'}
          onValueChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
        <Button label="1" type="num" onPress={() => console.log("Número 1")} />
        <Button label="+" type="op" onPress={() => console.log("Operador +")} />
        <Button label="=" type="equal" onPress={() => console.log("Igual")} />
        <Button label="C" type="clear" onPress={() => console.log("Clear")} />
      </View>
    </ThemeContext.Provider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsPallette.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
  }
})