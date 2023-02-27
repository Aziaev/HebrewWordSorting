import {
  ActivityIndicator,
  Dimensions,
  ListView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types/types";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../store/slices/strings/strings.hooks";
import { useEffect } from "react";
import { map } from "lodash";
import { EStatus } from "../types";
import { FlashList } from "@shopify/flash-list";

export default function StringsScreen({
  navigation,
}: RootTabScreenProps<"Strings">) {
  const { search, list, status } = useStringsStateSelector();
  const { searchByString, setSearch } = useStringsDispatchedActions();

  useEffect(() => {
    setSearch("א");
  }, [setSearch]);

  useEffect(() => {
    if (search) {
      void searchByString({ search });
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
        {status === EStatus.loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <FlashList
            data={list}
            estimatedItemSize={100}
            renderItem={({ item, index, target, extraData }) => (
              <Text style={styles.text} key={item.id}>
                {item.word}
              </Text>
            )}
          />
        )}
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
  text: {
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 26,
    fontFamily: "David",
  },
  list: {
    flex: 1,
    width: Dimensions.get("screen").width,
  },
});
