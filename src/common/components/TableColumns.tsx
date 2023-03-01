import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";
import { Text, View } from "./Themed";

export default function TableColumns({ navigation }: { navigation: any }) {
  function handleHelpPress(path: string) {
    return () => navigation.navigate(path);
  }

  return (
    <View style={styles.helpContainer}>
      <TouchableOpacity
        onPress={handleHelpPress("Nikud")}
        style={styles.helpLink}
      >
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Nikud
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleHelpPress("Roots")}
        style={styles.helpLink}
      >
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Roots
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleHelpPress("Strings")}
        style={styles.helpLink}
      >
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Strings
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleHelpPress("Times")}
        style={styles.helpLink}
      >
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Times
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleHelpPress("Verbs")}
        style={styles.helpLink}
      >
        <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
          Verbs
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
});
