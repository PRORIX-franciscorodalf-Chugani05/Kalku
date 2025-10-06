import { StyleSheet } from "react-native";
import { colorsPallette } from "./Colors";

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorsPallette.bgLight,
        justifyContent: 'center',
        alignItems: 'center',
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
    },
    viewButtom: {
        position: 'absolute',
        flexDirection: "row",
    },
    // screenFirstNumber: {
    //     fontSize: 96,
    //     color: colorsPallette.grey,
    //     fontWeight: '200',
    //     alignSelf: "flex-end",
    // },
    // screenSecondNumber: {
    //     fontSize: 40,
    //     color: colorsPallette.grey,
    //     fontWeight: '200',
    //     alignSelf: "flex-end",
    // }
})
