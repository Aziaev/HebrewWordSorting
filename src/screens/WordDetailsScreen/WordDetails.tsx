import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { useEffect } from "react";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../store/slices/wordDetails/wordDetails.hooks";
import WordList from "./components/WordList";
import { VerbConjugationTables } from "./components/VerbConjugationTables";

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={40}
    >
      <View style={styles.container}>
        <WordList />
        {isVerb && <VerbConjugationTables />}
        {selectedBinyan && <VerbConjugationTables />}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: Dimensions.get("screen").width,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
});

WordDetails.path = "WordDetails";

function checkHasLinksForVerb(str?: string) {
  if (!str) {
    return false;
  }

  return /[A-Za-z]/.test(str) && /[0-9]/.test(str);
}
