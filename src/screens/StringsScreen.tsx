import { Dimensions, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types/types";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../store/slices/strings/strings.hooks";
import { useEffect } from "react";
import { EStatus } from "../types";
import { FlashList } from "@shopify/flash-list";
import Loader from "../components/Loader";

export default function StringsScreen({
  navigation,
}: RootTabScreenProps<"Strings">) {
  const { search, list, status, error } = useStringsStateSelector();
  const { searchByString, setSearch, fetchNextPage } =
    useStringsDispatchedActions();

  console.log("listlength", list.length);

  useEffect(() => {
    setSearch("א");
  }, [setSearch]);

  useEffect(() => {
    if (search) {
      // void debounce(searchByString, 500);
      void searchByString();
    }
  }, [search, searchByString]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={search}
        onChangeText={setSearch}
        placeholder="..."
        placeholderTextColor={"grey"}
      />
      <View style={styles.list}>
        {list.length === 0 && (
          <Text style={styles.text}>Ничего не найдено</Text>
        )}
        {error && <Text style={styles.text}>{error}</Text>}
        {status === EStatus.loading && <Loader />}
        <FlashList
          data={list}
          estimatedItemSize={100}
          renderItem={({ item }) => (
            <Text style={styles.word} key={item.id}>
              {item.word}
            </Text>
          )}
          onEndReachedThreshold={0.75}
          onEndReached={fetchNextPage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  textInput: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 26,
    width: "100%",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    fontFamily: "David",
  },
  word: {
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 26,
    fontFamily: "David",
  },
  text: {
    textAlign: "center",
    width: "100%",
    justifyContent: "flex-start",
    padding: 10,
    fontSize: 18,
  },
  list: {
    flex: 1,
    width: Dimensions.get("screen").width,
  },
});
