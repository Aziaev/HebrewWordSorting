import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../common/components/Themed";
import { RootTabScreenProps } from "../types/types";
import { useDatabaseStateSelector } from "../store/slices/dataBase/database.hooks";

export default function DBLoadingScreen({
  navigation,
}: RootTabScreenProps<"DBLoadingScreen">) {
  const { status } = useDatabaseStateSelector();
  return (
    <View style={styles.container}>
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
