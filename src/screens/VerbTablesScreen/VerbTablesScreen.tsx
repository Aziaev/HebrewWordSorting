import { Dimensions, StyleSheet, Text, View } from "react-native";
import Colors from "../../common/constants/Colors";

export default function VerbTablesScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>VerbTablesScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
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

VerbTablesScreen.path = "VerbTablesScreen";
