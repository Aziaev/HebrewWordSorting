import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { ELanguage } from "../../../store/slices/strings/strings";
import { getIsRtl } from "../../../common/helpers";
import { Text } from "../../../common/components/Themed";
import { FLAGS_MAP } from "../../../constants";
import * as React from "react";
import { noop } from "lodash";

export default function SearchInput() {
  const { search, inputLanguage } = useStringsStateSelector();
  const { setSearch } = useStringsDispatchedActions();

  const isRtl = getIsRtl(inputLanguage);

  return (
    <View style={styles.inputGroup}>
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
          const formattedText = formatters[inputLanguage](text).trim();

          setSearch(formattedText);
        }}
        placeholder="..."
        placeholderTextColor={"grey"}
      />
      <Pressable
        onPress={noop}
        style={({ pressed }) => {
          let opacity = 1;

          if (pressed) {
            opacity = 0.8;
          }

          return { opacity };
        }}
      >
        <View style={styles.button}>
          <Text style={styles.flag}>{FLAGS_MAP[inputLanguage]}</Text>
        </View>
      </Pressable>
    </View>
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
  },
  inputGroup: {
    display: "flex",
    flexDirection: "row",
    height: 50,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  button: {
    width: 60,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginRight: 10,
  },
  flag: {
    fontSize: 26,
  },
});

const formatters = {
  [ELanguage.he]: (text: string) => text.replace(/[^\u0590-\u05fe ]+$/i, ""),
  [ELanguage.en]: (text: string) => text.replace(/[^A-Za-z ]+$/i, ""),
  [ELanguage.ru]: (text: string) => text.replace(/[^А-ЯҐЄІЇ ]+$/i, ""),
  [ELanguage.ua]: (text: string) => text.replace(/[^А-ЯҐЄІЇ ]+$/i, ""),
};
