import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Text, View } from "../../common/components/Themed";
import { useStringsStateSelector } from "../../store/slices/strings/strings.hooks";
import { EStatus } from "../../types";
import SearchInput from "./components/SearchInput";
import StringList from "./components/StringList";
import BottomBarButtons from "../../common/components/BottomBarButtons";
import { ELanguage, NOTHING_FOUND } from "../../common/constants";
import { getIsHebrewText } from "../../common/helpers";

export default function StringsScreen() {
  const { search, list, status, language } = useStringsStateSelector();
  const isHebrewSearch = getIsHebrewText(search);
  const isLoading = status === EStatus.loading;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={40}
    >
      <View style={styles.container}>
        <SearchInput />
        <View style={styles.searchResult}>
          {list.length === 0 && search && !isLoading && (
            <Text style={styles.text}>
              {(isHebrewSearch && NOTHING_FOUND[ELanguage.en]) ||
                NOTHING_FOUND[language]}
            </Text>
          )}
          <StringList />
        </View>
        <BottomBarButtons />
      </View>
    </KeyboardAvoidingView>
  );
}

StringsScreen.path = "StringsScreen";

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
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
