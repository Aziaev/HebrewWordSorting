import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import { IVerb } from "../../../types";
import { map } from "lodash";
import { useWordDetailsScreenStateSelector } from "../../../store/slices/wordDetails/wordDetails.hooks";

export function VerbConjugationTables() {
  const { selected, verbs } = useWordDetailsScreenStateSelector();

  return (
    <View>
      <View style={styles.card}>
        <Text
          style={styles.translations}
          adjustsFontSizeToFit
          numberOfLines={3}
        >
          Verb conjugation tables
        </Text>
        <View style={styles.hebrewWords}>
          <Text style={styles.hebrewText}>{selected?.root}</Text>
          {map(verbs, (verb: IVerb) => (
            <Text>{verb.b}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 3,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 20,
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
  hebrewWords: {
    height: 46,
    width: "100%",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  hebrewText: {
    fontSize: 32,
    fontFamily: "David",
  },
  word: {
    textAlign: "right",
    flex: 1,
    color: "black",
  },
  auxWords: {
    textAlign: "left",
    flex: 1,
    color: "brown",
    fontSize: 24,
  },
});
