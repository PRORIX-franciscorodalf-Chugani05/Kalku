import { myColors } from '@/styles/colors';
import { ThemeContext } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Switch, View } from "react-native";

export default function Index() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <View style={theme === 'light' ? StyleSheet.container : [style.container, {backgroundColor: '#000'}]}>
        <StatusBar style="auto" />
        <Switch
          value={theme === 'light'}
          onValueChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        />
      </View>
    </ThemeContext.Provider>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: myColors.light,
    justifyContent: 'center',
    alignItems: 'center',
  }
})