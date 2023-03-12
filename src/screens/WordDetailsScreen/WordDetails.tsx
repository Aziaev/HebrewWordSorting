import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect } from "react";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../store/slices/wordDetails/wordDetails.hooks";
import WordList from "./components/WordList";
import { VerbConjugationTables } from "./components/VerbConjugationTables";
import { VerbInfinitive } from "./components/VerbInfinitive";
import { Verbs } from "./components/Verbs";
import BottomBarButtons from "../../common/components/BottomBarButtons";

export default function WordDetails() {
  const { searchMatchingWords, reset, searchBinyans } =
    useWordDetailsScreenDispatchedActions();
  const { selected, selectedBinyan } = useWordDetailsScreenStateSelector();

  const isVerb = selected?.r && selected.links;

  useEffect(() => {
    if (selected && checkHasLinksForVerb(selected?.links)) {
      // Проверить есть ли в links буквы и цифры регуляркой
      searchBinyans(selected);
    }
  }, [searchBinyans, selected]);

  useEffect(() => {
    searchMatchingWords();

    return () => {
      reset();
    };
  }, [searchMatchingWords, reset]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroollView}>
        <WordList />
        {isVerb && <VerbConjugationTables />}
        {isVerb && selectedBinyan && <VerbInfinitive />}
        {isVerb && <Verbs />}
      </ScrollView>
      <BottomBarButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scroollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});

WordDetails.path = "WordDetails";

function checkHasLinksForVerb(str?: string) {
  if (!str) {
    return false;
  }

  return /[A-Za-z]/.test(str) && /[0-9]/.test(str);
}
