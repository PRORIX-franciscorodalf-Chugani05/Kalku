import { StyleSheet } from "react-native";
import { colorsPallette } from "./Colors";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorsPallette.bgLight,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  controlBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
  },
  screen: {
    borderRadius: 24,
    padding: 24,
    minHeight: 140,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    marginTop: 16,
    marginBottom: 12,
  },
  expressionText: {
    fontSize: 24,
    opacity: 0.7,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 64,
    fontWeight: "700",
  },
  keypad: {
    marginTop: 32,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  label: {
    fontSize: 26,
    fontWeight: "600",
  },
  zeroButton: {
    flex: 2,
  },
  historyButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  historyPanel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxHeight: "60%",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  historyItemText: {
    flex: 1,
    marginRight: 12,
  },
  historyExpression: {
    fontSize: 16,
    opacity: 0.7,
  },
  historyResult: {
    fontSize: 20,
    fontWeight: "700",
  },
  historyEmpty: {
    textAlign: "center",
    paddingVertical: 32,
    fontSize: 16,
    opacity: 0.6,
  },
  historyDeleteButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  historyDeleteText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
