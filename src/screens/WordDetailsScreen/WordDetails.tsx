import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
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
  const { searchMatchingWords, reset, searchVerbs } =
    useWordDetailsScreenDispatchedActions();
  const { selected, verbs } = useWordDetailsScreenStateSelector();

  useEffect(() => {
    if (selected?.r && selected.links) {
      searchVerbs();
    }
  }, [searchVerbs, selected]);

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
        {/* <VerbConjugationTables /> */}
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
    paddingTop: 10,
    paddingBottom: 10,
  },
});

WordDetails.path = "WordDetails";
