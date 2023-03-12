import { StyleSheet, Text, View } from "react-native";
import Colors from "../../../common/constants/Colors";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../../store/slices/wordDetails/wordDetails.hooks";
import { useEffect } from "react";
import { useStringsStateSelector } from "../../../store/slices/strings/strings.hooks";

export function VerbInfinitive() {
  const { selected, selectedBinyan, binyans, infinitiveTranslation } =
    useWordDetailsScreenStateSelector();
  const { fetchVerbInfinitive, fetchInfinitiveTranslations } =
    useWordDetailsScreenDispatchedActions();

  const { language } = useStringsStateSelector();

  console.log({ infinitiveTranslation });

  useEffect(() => {
    if (selectedBinyan && selected) {
      void fetchVerbInfinitive(selected, selectedBinyan);
    }
  }, [fetchVerbInfinitive, selected, selectedBinyan]);

  useEffect(() => {
    if (selectedBinyan && binyans && selected) {
      void fetchInfinitiveTranslations({
        root: selected.root,
        binyan: binyans[selectedBinyan],
      });
    }
  }, [binyans, fetchInfinitiveTranslations, selected, selectedBinyan]);

  const translation = infinitiveTranslation?.[language];

  return (
    <View style={styles.card}>
      <Text style={styles.translations} adjustsFontSizeToFit numberOfLines={3}>
        {translation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: Colors.grey2,
    borderWidth: 1,
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
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 32,
    fontFamily: "David",
  },
});
