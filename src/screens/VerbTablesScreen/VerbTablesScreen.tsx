import { Dimensions, StyleSheet } from "react-native";
import { View } from "../../common/components/Themed";

export default function VerbTablesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <text>fdsfsdfa</text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    textAlign: "center",
    width: "100%",
    justifyContent: "flex-start",
    padding: 10,
    fontSize: 18,
  },
  searchResult: {
    flex: 1,
    width: Dimensions.get("screen").width,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
