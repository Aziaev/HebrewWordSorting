import { Dimensions, StyleSheet, TextInput } from "react-native";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { ELanguage } from "../../../store/slices/strings/strings";
import { getIsRtl } from "../../../common/helpers";

export default function SearchInput() {
  const { search, lang } = useStringsStateSelector();
  const { setSearch } = useStringsDispatchedActions();

  const isRtl = getIsRtl(lang);

  return (
    <TextInput
      style={[
        styles.textInput,
        {
          textAlign: isRtl ? "right" : "left",
          fontFamily: isRtl ? "David" : undefined,
        },
      ]}
      value={search}
      onChangeText={(text) => {
        const formattedText = formatters[lang](text).trim();

        setSearch(formattedText);
      }}
      placeholder="..."
      placeholderTextColor={"grey"}
    />
  );
}

const styles = StyleSheet.create({
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
});

const formatters = {
  [ELanguage.he]: (text: string) => text.replace(/[^\u0590-\u05fe ]+$/i, ""),
  [ELanguage.en]: (text: string) => text.replace(/[^A-Za-z ]+$/i, ""),
  [ELanguage.ru]: (text: string) => text.replace(/[^А-ЯҐЄІЇ ]+$/i, ""),
  [ELanguage.ua]: (text: string) => text.replace(/[^А-ЯҐЄІЇ ]+$/i, ""),
};
