import { Dimensions, StyleSheet } from "react-native";
import { Text, View } from "../../common/components/Themed";
import { RootTabScreenProps } from "../../types/types";
import { useStringsStateSelector } from "../../store/slices/strings/strings.hooks";
import { EStatus } from "../../types";
import SearchInput from "./components/SearchInput";
import StringList from "./components/StringList";

export default function StringsScreen({
  navigation,
}: RootTabScreenProps<"Strings">) {
  const { search, list, status, error } = useStringsStateSelector();
  const isLoading = status === EStatus.loading;

  return (
    <View style={styles.container}>
      <SearchInput />
      <View style={styles.searchResult}>
        {list.length === 0 && search && !isLoading && (
          <Text style={styles.text}>Ничего не найдено</Text>
        )}
        {error && <Text style={styles.text}>{error}</Text>}
        <StringList />
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
  text: {
    textAlign: "center",
    width: "100%",
    justifyContent: "flex-start",
    padding: 10,
    fontSize: 18,
  },
  searchResult: {
    flex: 1,
    width: Dimensions.get("screen").width,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
