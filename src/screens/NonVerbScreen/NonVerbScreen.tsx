import { StyleSheet, Text, View } from "react-native";
import Colors from "../../common/constants/Colors";

export default function NonVerbScreen() {
  return (
    <View style={styles.container}>
      <Text>Non verb screen</Text>
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
});

NonVerbScreen.path = "NonVerbScreen";
