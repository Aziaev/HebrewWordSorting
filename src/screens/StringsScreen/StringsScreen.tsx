import { Dimensions, StyleSheet } from "react-native";
import { Text, View } from "../../common/components/Themed";
import { RootTabScreenProps } from "../../types/types";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../store/slices/strings/strings.hooks";
import { useEffect } from "react";
import { EStatus } from "../../types";
import { ELanguage } from "../../store/slices/strings/strings";
import SearchInput from "./components/SearchInput";
import { getIsRtl } from "../../common/helpers";
import StringList from "./components/StringList";
import Loader from "../../common/components/Loader";

export default function StringsScreen({
  navigation,
}: RootTabScreenProps<"Strings">) {
  const { search, list, status, error, lang } = useStringsStateSelector();
  const { searchByString, setSearch } = useStringsDispatchedActions();
  const isRtl = getIsRtl(lang);

  useEffect(() => {
    if (lang === ELanguage.he) {
      setSearch("א");
    }
  }, []);

  useEffect(() => {
    if (isRtl && search) {
      void searchByString();
    }
  }, [isRtl, search, searchByString]);
  const isLoading = status === EStatus.loading;

  return (
    <View style={styles.container}>
      <SearchInput />
      <View style={styles.searchResult}>
        {list.length === 0 && search && !isLoading && (
          <Text style={styles.text}>Ничего не найдено</Text>
        )}
        {error && <Text style={styles.text}>{error}</Text>}
        {status === EStatus.loading && <Loader />}
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
