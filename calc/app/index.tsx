import React, { useState } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";

export default function Home() {
  const [input, setInput] = useState("0");
  const [result, setResult] = useState("0");

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
    setInput("0");
    setResult("0");
  };

  const borrarUltimo = () => {
    const nuevoInput = input.length > 1 ? input.slice(0, -1) : "0";
    setInput(nuevoInput);
    calcular(nuevoInput);
  };

  const aplicarResultado = () => {
    if (result !== "") setInput(result);
  };

  const agregarPunto = () => {
    const partes = input.split(/[\+\-\*\/]/);
    const ultimoNumero = partes[partes.length - 1];
    if (ultimoNumero.includes(".")) return; // ya hay un punto
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

    // evitar operadores seguidos
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
    ["⌫", "AC", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

  return (
    <View style={styles.container}>
      {/* Pantalla */}
      <View style={styles.display}>
        <Text>{input}</Text>
        <Text>{result}</Text>
      </View>

      {/* Botonera */}
      <View>
        {buttons.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((btn) => (
              <Pressable key={btn} onPress={() => handlePress(btn)}>
                <Text>{btn}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
  },
  display: {
    marginBottom: 20,
    alignItems: "flex-end",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});
