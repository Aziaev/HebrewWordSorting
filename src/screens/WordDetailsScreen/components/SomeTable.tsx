import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import { useWordDetailsScreenStateSelector } from "../../../store/slices/wordDetails/wordDetails.hooks";

export function SomeTable() {
  const { binyans, selectedBinyan } = useWordDetailsScreenStateSelector();

  return (
    <View style={styles.card}>
      <Text style={styles.translations} adjustsFontSizeToFit numberOfLines={3}>
        selected binyan
      </Text>
      <Text style={styles.hebrewText}>{selectedBinyan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingTop: 3,
    marginBottom: 3,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    width: "100%",
  },
  translations: {
    minHeight: 32,
    backgroundColor: Colors.grey2,
    width: "100%",
    paddingBottom: 5,
    paddingTop: 3,
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  hebrewText: {
    textAlign: "center",
    height: 46,
    width: "100%",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 32,
    fontFamily: "David",
  },
  pressable: {
    textAlign: "center",
    width: "100%",
    borderColor: Colors.grey2,
    borderTopWidth: 1,
    backgroundColor: Colors.grey1,
  },
  selected: {
    borderColor: Colors.grey3,
    backgroundColor: "white",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
  },
});
