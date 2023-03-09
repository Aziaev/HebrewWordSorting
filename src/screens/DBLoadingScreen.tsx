import { ActivityIndicator, StyleSheet } from "react-native";
import { Text, View } from "../common/components/Themed";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";

export default function DBLoadingScreen() {
  const { status } = useDatabaseStateSelector();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="black" />
      <Text style={styles.title}>DB is loading</Text>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "grey",
  },
});
