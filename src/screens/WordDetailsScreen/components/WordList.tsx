import { useEffect } from "react";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../../store/slices/wordDetails/wordDetails.hooks";
import { map } from "lodash";
import { WordListItemCard } from "./WordListItemCard";
import { StyleSheet, View } from "react-native";

export default function WordList() {
  const { list, selected, selectedBinyan } =
    useWordDetailsScreenStateSelector();
  const { searchMatchingWords, reset, setSelected, fetchRoots } =
    useWordDetailsScreenDispatchedActions();

  useEffect(() => {
    searchMatchingWords();

    return () => {
      reset();
    };
  }, [searchMatchingWords, reset]);

  useEffect(() => {
    if (selected && selectedBinyan) {
      void fetchRoots(selected);
    }
  }, [fetchRoots, selected, selectedBinyan]);

  return (
    <View style={styles.wordList}>
      {map(list, (item) => (
        <WordListItemCard
          key={item.id}
          selected={item.id === selected?.id}
          onPress={() => setSelected(item)}
          str={item}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wordList: {},
});
