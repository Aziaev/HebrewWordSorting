import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import { filter, isEmpty, map } from "lodash";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../../store/slices/wordDetails/wordDetails.hooks";
import { useEffect, useMemo } from "react";

export function VerbConjugationTables() {
  const { selected, binyans, selectedBinyan } =
    useWordDetailsScreenStateSelector();
  const { setSelectedBinyan } = useWordDetailsScreenDispatchedActions();

  const sortedBinyanKeys = useMemo(
    () =>
      (binyans &&
        filter(
          Object.keys(binyans).sort(),
          (str) => !["base", "face", "id", "r"].includes(str)
        )) ||
      [],
    [binyans]
  );

  useEffect(() => {
    if (!isEmpty(sortedBinyanKeys)) {
      setSelectedBinyan(sortedBinyanKeys[0]);
    }
  }, [setSelectedBinyan, sortedBinyanKeys]);

  return (
    <View style={styles.card}>
      <Text style={styles.translations} adjustsFontSizeToFit numberOfLines={3}>
        Verb conjugation tables
      </Text>
      <View style={styles.row}>
        <Text
          style={[styles.hebrewText, styles.word]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {selected?.root}
        </Text>
        <Text
          style={[styles.hebrewText, styles.auxWords]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          שוֹרֶש
        </Text>
      </View>
      {binyans &&
        map(sortedBinyanKeys, (binyan, index) => {
          /* @ts-expect-error */
          return binyans[binyan] ? (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedBinyan(binyan);
              }}
              style={{
                ...styles.pressable,
                ...(selectedBinyan === binyan ? styles.selected : {}),
              }}
            >
              <Text style={styles.hebrewText}>
                {/* @ts-expect-error */}
                {binyans[binyan]}
              </Text>
            </TouchableOpacity>
          ) : null;
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 8,
    borderColor: Colors.grey2,
    borderWidth: 1,
    borderRadius: 5,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    textAlign: "center",
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
  hebrewText: {
    textAlign: "center",
    height: 46,
    width: "100%",
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 32,
    fontFamily: "David",
  },
  pressable: {
    textAlign: "center",
    width: "100%",
    borderColor: Colors.grey2,
    borderTopWidth: 1,
    backgroundColor: Colors.grey1,
  },
  selected: {
    borderColor: Colors.grey3,
    backgroundColor: "white",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
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
