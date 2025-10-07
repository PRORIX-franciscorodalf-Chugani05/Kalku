import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Styles } from "@/styles/GlobalStyles";
import { colorsPallette } from '@/styles/Colors';
import { ThemeContext } from '@/context/themeContext';
import { StyleSheet, Switch, View, Text } from "react-native";
import Button from '@/components/Buttons';

export default function Index() {
  const [theme, setTheme] = useState("light");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const operadores = ["+", "-", "*", "/"];

  // --- FUNCIONES AUXILIARES ---
  const calcular = (expr: string) => {
    if (expr === "" || operadores.includes(expr.slice(-1))) {
      setResult("0");
      return;
    }
    try {
      const res = eval(expr).toString();
      setResult(res);
    } catch {
      setResult("0");
    }
  };

  const limpiarTodo = () => {
    setInput("");
    setResult("");
    setShowResult(false);
  };

  const borrarUltimo = () => {
    const nuevoInput = input.length > 1 ? input.slice(0, -1) : "0";
    setInput(nuevoInput);
    calcular(nuevoInput);
  };

  const aplicarResultado = () => {
    setShowResult(true);
    setInput(result);
  };

  const agregarPunto = () => {
    const partes = input.split(/[\+\-\*\/]/);
    const ultimoNumero = partes[partes.length - 1];
    if (ultimoNumero.includes(".")) return;
    const nuevoInput = input + ".";
    setInput(nuevoInput);
    calcular(nuevoInput);
  };

  const cambiarSigno = () => {
    if (result !== "0") {
      const nuevo = (parseFloat(result) * -1).toString();
      setInput(nuevo);
      setResult(nuevo);
    }
  };

  const aplicarPorcentaje = () => {
    if (result !== "0") {
      const nuevo = (parseFloat(result) / 100).toString();
      setInput(nuevo);
      setResult(nuevo);
    }
  };

  const agregarValor = (value: string) => {
    let simbolo = value;
    if (value === "×") simbolo = "*";
    if (value === "÷") simbolo = "/";

    let nuevoInput = input === "0" ? simbolo : input + simbolo;

    if (operadores.includes(simbolo) && operadores.includes(input.slice(-1))) {
      nuevoInput = input.slice(0, -1) + simbolo;
    }

    setInput(nuevoInput);
    calcular(nuevoInput);
  };

  // --- MANEJADOR PRINCIPAL ---
  const handlePress = (value: string) => {
    switch (value) {
      case "AC":
        limpiarTodo();
        break;
      case "⌫":
        borrarUltimo();
        break;
      case "=":
        aplicarResultado();
        break;
      case ".":
        agregarPunto();
        break;
      case "±":
        cambiarSigno();
        break;
      case "%":
        aplicarPorcentaje();
        break;
      default:
        agregarValor(value);
        break;
    }
  };

  // --- BOTONES ---
  const buttons = [
    [
      { label: "⌫", type: "clear" },
      { label: "AC", type: "clear" },
      { label: "%", type: "op" },
      { label: "÷", type: "op" }
    ],
    [
      { label: "7", type: "num" },
      { label: "8", type: "num" },
      { label: "9", type: "num" },
      { label: "×", type: "op" }
    ],
    [
      { label: "4", type: "num" },
      { label: "5", type: "num" },
      { label: "6", type: "num" },
      { label: "-", type: "op" }
    ],
    [
      { label: "1", type: "num" },
      { label: "2", type: "num" },
      { label: "3", type: "num" },
      { label: "+", type: "op" }
    ],
    [
      { label: "±", type: "num" },
      { label: "0", type: "num" },
      { label: ".", type: "num" },
      { label: "=", type: "equal" }
    ],
  ];

  return (
    <View style={styles.container}>
      <ThemeContext.Provider value={theme}>
        <View style={theme === 'light' ? Styles.container : [Styles.container, {backgroundColor: colorsPallette.bgDark}]}>
          <StatusBar style="auto" />
          <Switch
            value={theme === 'light'}
            onValueChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          />

          {/* Pantalla */}
          <View style={Styles.display}>
            <Text
              style={[
                Styles.input,
                theme === 'light' ? null : { color: colorsPallette.textDark },
                showResult && Styles.result
              ]}
            >
              {input}
            </Text>
          </View>

          {/* Botonera */}
          <View>
            {buttons.map((row, i) => (
              <View key={i} style={Styles.row}>
                {row.map((btn) => (
                  <Button
                    key={btn.label}
                    label={btn.label}
                    type={btn.type}
                    onPress={() => handlePress(btn.label)}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ThemeContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
});