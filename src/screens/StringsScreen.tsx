import {
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
import { isEmpty, noop } from "lodash";
import { FLAGS_MAP } from "../constants";
import { ELanguage } from "../store/slices/strings/strings";

export default function StringsScreen({
  navigation,
}: RootTabScreenProps<"Strings">) {
  const { search, list, status, error, lang } = useStringsStateSelector();
  const { searchByString, setSearch, fetchNextPage, toggleLanguage } =
    useStringsDispatchedActions();

  useEffect(() => {
    setSearch("א");
  }, [setSearch]);

  useEffect(() => {
    if (search) {
      void searchByString();
    }
  }, [search, searchByString]);

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput
          style={[
            styles.textInput,
            {
              textAlign: getIsRtl(lang) ? "right" : "left",
              fontFamily: getIsRtl(lang) ? "David" : undefined,
            },
          ]}
          value={search}
          onChangeText={(text) => {
            const formattedText = formatters[lang](text);

            setSearch(formattedText);
          }}
          placeholder="..."
          placeholderTextColor={"grey"}
        />
        <TouchableOpacity onPress={toggleLanguage} style={styles.langButton}>
          <Text style={styles.flag}>{FLAGS_MAP[lang]}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        {list.length === 0 && search && (
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
          onEndReached={isEmpty(list) ? noop : fetchNextPage}
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
  inputGroup: {
    width: Dimensions.get("window").width,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 55,
  },
  langButton: {
    height: 55,
    width: 50,
    backgroundColor: "#f7f7f7",
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 55,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 26,
    width: Dimensions.get("window").width - 50,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  flag: {
    fontSize: 26,
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

function getIsRtl(lang: ELanguage) {
  return lang === ELanguage.he;
}

const formatters = {
  [ELanguage.he]: (text: string) => text.replace(/[^\u0590-\u05fe ]+$/i, ""),
  [ELanguage.en]: (text: string) => text.replace(/[^A-Za-z ]+$/i, ""),
  [ELanguage.ru]: (text: string) => text.replace(/[^А-ЯҐЄІЇ ]+$/i, ""),
  [ELanguage.ua]: (text: string) => text.replace(/[^А-ЯҐЄІЇ ]+$/i, ""),
};
