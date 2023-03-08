import { TextInput, View } from "react-native";
import {
  useStringsDispatchedActions,
  useStringsStateSelector,
} from "../../../store/slices/strings/strings.hooks";
import { INPUT_PLACEHOLDER } from "../../../common/constants";
import * as React from "react";
import { useEffect, useMemo } from "react";
import { useAppSelector } from "../../../store/slices/app/app.hooks";
import Colors from "../../../common/constants/Colors";
import { getIsHebrewText } from "../../../common/helpers";
import { debounce } from "lodash";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchInput() {
  const { appLanguage } = useAppSelector();
  const { search } = useStringsStateSelector();
  const { setSearch, searchByString } = useStringsDispatchedActions();

  const debouncedSearchByString = useMemo(
    () => debounce(searchByString, 400),
    [searchByString]
  );

  useEffect(() => {
    debouncedSearchByString();
  }, [search, searchByString, appLanguage, debouncedSearchByString]);

  return (
    // @ts-expect-error
    <View style={getStyles(search).searchInput}>
      <TextInput
        // @ts-expect-error
        style={getStyles(search).textInput}
        value={search}
        onChangeText={setSearch}
        placeholder={INPUT_PLACEHOLDER[appLanguage]}
        placeholderTextColor={Colors.grey5}
      />
      {search && (
        <FontAwesome
          style={getStyles(search).closeIcon}
          name="close"
          backgroundColor="#fff"
          color={Colors.grey5}
          onPress={() => setSearch("")}
        />
      )}
    </View>
  );
}

function getStyles(search: string) {
  return {
    searchInput: {
      width: "100%",
      display: "flex",
      flexDirection: getIsHebrewText(search) ? "row-reverse" : "row",
      borderBottomColor: Colors.grey5,
      borderBottomWidth: 1,
    },
    closeIcon: {
      paddingTop: getIsHebrewText(search) ? 23 : 25,
      paddingBottom: 5,
      paddingLeft: 20,
      fontSize: 18,
      paddingRight: 20,
    },
    textInput: {
      flex: 1,
      paddingTop: 15,
      paddingBottom: 5,
      paddingLeft: 20,
      paddingRight: 20,
      fontSize: 18,
      fontFamily: getIsHebrewText(search) ? "David" : undefined,
      fontWeight: "500",
      textAlign: getDirection(search),
      height: 55,
    },
  };
}

function getDirection(text: string): "left" | "right" {
  return getIsHebrewText(text) ? "right" : "left";
}
