import { StyleSheet } from "react-native";
import { myColors } from "./Colors";

export const Styles = StyleSheet.create({
    btnBlue: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: myColors.blue,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    btnDark: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: myColors.dark,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    btnLight: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: myColors.white,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    btnGrey: {
        width: 72,
        height: 72,
        borderRadius: 24,
        backgroundColor: myColors.grey,
        justifyContent: "center",
        alignItems: "center",
        margin: 8,
    },
    smallTextLight: {
        fontSize: 32,
        color: myColors.white
    },
    smallTextDark: {
        fontSize: 32,
        color: myColors.black
    },
    row: {
        maxWidth: '100%',
        flexDirection: "row",
    },
    viewButtom: {
        position: 'absolute',
        flexDirection: "row",
    },
    screenFirstNumber: {
        fontSize: 96,
        color: myColors.grey,
        fontWeight: '200',
        alignSelf: "flex-end",
    },
    screenSecondNumber: {
        fontSize: 40,
        color: myColors.grey,
        fontWeight: '200',
        alignSelf: "flex-end",
    }
})