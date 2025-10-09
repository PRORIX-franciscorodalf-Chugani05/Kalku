import { StyleSheet } from "react-native";
import { colorsPallette } from "./Colors";

export const Styles = StyleSheet.create({
    calculatorContainer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 10,
    },
    container: {
        backgroundColor: colorsPallette.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {

    },
    keyboardContainer: {
        marginTop: 50,
        alignItems: "flex-end",
    },
    btn: {
        width: 72,
        height: 72,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    label: {
        fontSize: 24,
        fontWeight: "600",
    },
    row: {
        maxWidth: '100%',
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
    },
    display: {
        marginBottom: 20,
        alignItems: "flex-end",
        width: 350,
        height: 100,
    },
    input: {
        color: colorsPallette.textLight,
        padding: 15,
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    result: {
        color: colorsPallette.resultLight,
        padding: 15,
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'right',
    }
})
