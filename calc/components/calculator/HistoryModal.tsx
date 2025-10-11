import { memo } from "react";
import {
  FlatList,
  GestureResponderEvent,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Styles } from "@/styles/GlobalStyles";
import { HistoryEntry } from "@/types/calculator";
import { Ionicons } from '@expo/vector-icons';

type HistoryModalProps = {
  visible: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onSelect: (item: HistoryEntry) => void;
  onDelete: (index: number) => void;
  onClear: () => void;
  textColor: string;
  screenColor: string;
  isLightTheme: boolean;
};

const HistoryModal = ({
  visible,
  history,
  onClose,
  onSelect,
  onDelete,
  onClear,
  textColor,
  screenColor,
  isLightTheme,
}: HistoryModalProps) => (
  <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={Styles.historyModalOverlay}>
        <TouchableWithoutFeedback onPress={() => {}}>
          <View style={[Styles.historyPanel, { backgroundColor: screenColor }]}>
            <View style={Styles.historyHeader}>
              <Text style={[Styles.historyTitle, { color: textColor }]}>Historial</Text>
              <View style={Styles.historyActions}>
                {history.length > 0 ? (
                  <TouchableOpacity
                    style={[Styles.historyButton, { borderColor: textColor }]}
                    onPress={onClear}
                  >
                    <Ionicons
                      name={isLightTheme ? 'trash' : 'trash-outline'}
                      size={30}
                      color={isLightTheme ? 'black' : 'white'}
                    />
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={history.length > 0 ? Styles.historyActionButtonSpacing : undefined}
                  onPress={onClose}
                >
                  <Ionicons
                    name={isLightTheme ? 'close-circle' : 'close-circle-outline'}
                    size={30}
                    color={isLightTheme ? 'black' : 'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={history}
              keyExtractor={(item, index) => `${item.expression}-${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    Styles.historyItem,
                    { borderBottomColor: isLightTheme ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" },
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <View style={Styles.historyItemText}>
                    <Text
                      style={[Styles.historyExpression, { color: textColor }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.6}
                    >
                      {item.expression} =
                    </Text>
                    <Text
                      style={[Styles.historyResult, { color: textColor }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.6}
                    >
                      {item.result}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[Styles.historyDeleteButton, { borderColor: textColor }]}
                    onPress={(event) => {
                    event.stopPropagation();
                    onDelete(index);
                    }}
                  >
                    <Ionicons
                      name={isLightTheme ? 'remove-circle' : 'remove-circle-outline'}
                      size={26}
                      color={isLightTheme ? 'black' : 'white'}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                history.length === 0 ? { flexGrow: 1, justifyContent: "center" } : undefined
              }
              ListEmptyComponent={
                <Text style={[Styles.historyEmpty, { color: textColor }]}>Sin cálculos guardados</Text>
              }
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

export default memo(HistoryModal);
