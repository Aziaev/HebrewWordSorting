import { useEffect } from "react";
import {
  useWordDetailsScreenDispatchedActions,
  useWordDetailsScreenStateSelector,
} from "../../../store/slices/wordDetails/wordDetails.hooks";
import { map, sortBy } from "lodash";
import { WordListItemCard } from "./WordListItemCard";
import { Dimensions, StyleSheet, View } from "react-native";

export default function WordList() {
  const { list, selected } = useWordDetailsScreenStateSelector();
  const { searchMatchingWords, reset, setSelected } =
    useWordDetailsScreenDispatchedActions();

  useEffect(() => {
    searchMatchingWords();

    return () => {
      reset();
    };
  }, [searchMatchingWords, reset]);

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
  wordList: {
    width: Dimensions.get("screen").width,
  },
});
