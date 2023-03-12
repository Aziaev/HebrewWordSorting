import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../../store/slices/wordDetails/wordDetails.hooks";
import { useEffect } from "react";
import { find, isEmpty, map } from "lodash";

export function Verbs() {
  const { selected, selectedBinyan, verbs, infinitive } =
    useWordDetailsScreenStateSelector();
  const { fetchVerbs } = useWordDetailsScreenDispatchedActions();

  useEffect(() => {
    if (infinitive?.base) {
      void fetchVerbs(infinitive.base);
    }
  }, [fetchVerbs, infinitive, selected, selectedBinyan]);

  return (
    <View style={styles.card}>
      {Array.isArray(verbs) &&
        !isEmpty(verbs) &&
        map(verbsTableGroups, (group, index) => (
          <View key={index}>
            {group.title && (
              <Text style={styles.groupTitle}>{group.title}</Text>
            )}
            {map(group.keys, (key, index) => {
              const verb = find(verbs, (verb) => verb.r === key);
              let text = "-";

              if (verb) {
                text = verb.face.replace(group.prefix || "", "");
              }

              const prefix = text;
              // @ts-expect-error
              const word = verb?.[selectedBinyan];

              return (
                <View style={styles.row} key={index}>
                  <Text
                    style={[styles.hebrewText, styles.word]}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {word}
                  </Text>
                  <Text
                    style={[styles.hebrewText, styles.auxWords]}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {prefix}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
    </View>
  );
}

const verbsTableGroups = [
  {
    keys: ["a"],
  },
  { title: "הוֹוֶה", prefix: "הוֹוֶה", keys: ["b", "c", "d", "e"] },
  {
    title: "עָבָר",
    prefix: "עָבָר",
    keys: ["f", "g", "h", "i", "j", "k", "l", "m", "n"],
  },
  {
    title: "עָבָר",
    prefix: "עָבָר",
    keys: ["o", "p", "q", "r", "s", "t", "u", "v"],
  },
  { title: "צִווּי", prefix: "צִווּי", keys: ["w", "x", "y"] },
];

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 0,
    marginBottom: 100,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    textAlign: "center",
    width: "100%",
  },
  hebrewText: {
    fontSize: 32,
    fontFamily: "David",
  },
  groupTitle: {
    backgroundColor: Colors.grey1,
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
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  word: {
    textAlign: "right",
    flex: 1,
    color: "black",
    padding: 0,
  },
  auxWords: {
    textAlign: "left",
    flex: 1,
    color: "brown",
    fontSize: 24,
  },
});
