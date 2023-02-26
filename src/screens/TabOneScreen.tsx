import {StyleSheet} from "react-native";
import TableColumns from "../components/TableColumns";
import {Text, View} from "../components/Themed";
import {RootTabScreenProps} from "../types/types";
import {useDbInit} from "../db/hooks";

export default function TabOneScreen({
                                       navigation,
                                     }: RootTabScreenProps<"TabOne">) {
  const status = useDbInit()


  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {ready && <TableColumns navigation={navigation} />}
      {status === "DB is ready" && <TableColumns navigation={navigation}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
});
