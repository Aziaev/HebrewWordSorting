import { StyleSheet, Text, View } from "react-native";

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Help screen</Text>
    </View>
  );
}

HelpScreen.path = "HelpScreen";

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
});
